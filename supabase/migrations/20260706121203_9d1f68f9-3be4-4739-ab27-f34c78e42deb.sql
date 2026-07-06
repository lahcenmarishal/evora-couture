
-- Enum for tracking status
DO $$ BEGIN
  CREATE TYPE public.tracking_status AS ENUM (
    'commande_recue','preparation','packaging','pris_en_charge',
    'en_transport','arrive_agence','en_livraison','livre',
    'retour_agence','refuse','annule'
  );
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- Extend orders
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS tracking_number text UNIQUE,
  ADD COLUMN IF NOT EXISTS tracking_status public.tracking_status NOT NULL DEFAULT 'commande_recue',
  ADD COLUMN IF NOT EXISTS shipped_at timestamptz,
  ADD COLUMN IF NOT EXISTS estimated_delivery_at timestamptz,
  ADD COLUMN IF NOT EXISTS delivered_at timestamptz,
  ADD COLUMN IF NOT EXISTS deposit_amount numeric NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS shipping_city text;

-- Auto-generate tracking number on insert
CREATE OR REPLACE FUNCTION public.set_tracking_number()
RETURNS trigger LANGUAGE plpgsql SECURITY DEFINER SET search_path=public AS $$
BEGIN
  IF NEW.tracking_number IS NULL THEN
    NEW.tracking_number := 'EVC-' || to_char(now(),'YYYYMMDD') || '-' ||
      upper(substr(replace(gen_random_uuid()::text,'-',''),1,6));
  END IF;
  RETURN NEW;
END $$;

DROP TRIGGER IF EXISTS trg_orders_tracking_number ON public.orders;
CREATE TRIGGER trg_orders_tracking_number
BEFORE INSERT ON public.orders
FOR EACH ROW EXECUTE FUNCTION public.set_tracking_number();

-- Backfill existing rows
UPDATE public.orders
SET tracking_number = 'EVC-' || to_char(created_at,'YYYYMMDD') || '-' ||
  upper(substr(replace(id::text,'-',''),1,6))
WHERE tracking_number IS NULL;

-- Tracking events table
CREATE TABLE IF NOT EXISTS public.order_tracking_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  status public.tracking_status NOT NULL,
  comment text,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.order_tracking_events TO authenticated;
GRANT ALL ON public.order_tracking_events TO service_role;

ALTER TABLE public.order_tracking_events ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Admins manage tracking events" ON public.order_tracking_events;
CREATE POLICY "Admins manage tracking events" ON public.order_tracking_events
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(),'admin'))
  WITH CHECK (public.has_role(auth.uid(),'admin'));

CREATE INDEX IF NOT EXISTS idx_tracking_events_order ON public.order_tracking_events(order_id, occurred_at DESC);

-- Public lookup by tracking number (no auth needed)
CREATE OR REPLACE FUNCTION public.get_order_tracking(_tracking text)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path=public AS $$
DECLARE result jsonb; o record;
BEGIN
  SELECT * INTO o FROM public.orders WHERE tracking_number = _tracking LIMIT 1;
  IF NOT FOUND THEN RETURN NULL; END IF;
  SELECT jsonb_build_object(
    'tracking_number', o.tracking_number,
    'order_number', o.order_number,
    'customer_name', o.customer_name,
    'shipping_city', COALESCE(o.shipping_city, o.shipping_address->>'city'),
    'created_at', o.created_at,
    'shipped_at', o.shipped_at,
    'estimated_delivery_at', o.estimated_delivery_at,
    'delivered_at', o.delivered_at,
    'total', o.total,
    'deposit_amount', o.deposit_amount,
    'remaining_amount', (o.total - COALESCE(o.deposit_amount,0)),
    'status', o.status,
    'tracking_status', o.tracking_status,
    'events', COALESCE((
      SELECT jsonb_agg(jsonb_build_object(
        'status', e.status, 'comment', e.comment, 'occurred_at', e.occurred_at
      ) ORDER BY e.occurred_at DESC)
      FROM public.order_tracking_events e WHERE e.order_id = o.id
    ), '[]'::jsonb)
  ) INTO result;
  RETURN result;
END $$;

GRANT EXECUTE ON FUNCTION public.get_order_tracking(text) TO anon, authenticated;

import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import {
  Package, CheckCircle2, Boxes, PackageCheck, Truck, MapPin,
  Bike, Home, RotateCcw, XCircle, Ban, Search, Loader2,
} from 'lucide-react';

type TrackingStatus =
  | 'commande_recue' | 'preparation' | 'packaging' | 'pris_en_charge'
  | 'en_transport' | 'arrive_agence' | 'en_livraison' | 'livre'
  | 'retour_agence' | 'refuse' | 'annule';

type Event = { status: TrackingStatus; comment: string | null; occurred_at: string };
type TrackingData = {
  tracking_number: string;
  order_number: string;
  customer_name: string;
  shipping_city: string | null;
  created_at: string;
  shipped_at: string | null;
  estimated_delivery_at: string | null;
  delivered_at: string | null;
  total: number;
  deposit_amount: number;
  remaining_amount: number;
  status: string;
  tracking_status: TrackingStatus;
  events: Event[];
};

const STEPS: { key: TrackingStatus; label: string; icon: any }[] = [
  { key: 'commande_recue', label: 'Commande reçue', icon: CheckCircle2 },
  { key: 'preparation', label: 'Préparation', icon: Boxes },
  { key: 'packaging', label: 'Packaging', icon: PackageCheck },
  { key: 'pris_en_charge', label: 'Pris en charge', icon: Package },
  { key: 'en_transport', label: 'En transport', icon: Truck },
  { key: 'arrive_agence', label: 'Arrivé à l\'agence locale', icon: MapPin },
  { key: 'en_livraison', label: 'En cours de livraison', icon: Bike },
  { key: 'livre', label: 'Livré', icon: Home },
];

const STATUS_LABEL: Record<TrackingStatus, string> = {
  commande_recue: 'Commande reçue', preparation: 'Préparation', packaging: 'Packaging',
  pris_en_charge: 'Pris en charge', en_transport: 'En transport',
  arrive_agence: 'Arrivé à l\'agence', en_livraison: 'En livraison', livre: 'Livré',
  retour_agence: 'Retour en agence', refuse: 'Refusé', annule: 'Annulé',
};

const NEGATIVE: TrackingStatus[] = ['retour_agence', 'refuse', 'annule'];

const fmtDH = (n: number) => new Intl.NumberFormat('fr-MA').format(n) + ' DH';
const fmtDate = (d: string | null) =>
  d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
const fmtDT = (d: string) =>
  new Date(d).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

interface Props { open: boolean; onOpenChange: (o: boolean) => void; }

export function TrackingDialog({ open, onOpenChange }: Props) {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<TrackingData | null>(null);

  const search = async () => {
    if (!code.trim()) return;
    setLoading(true); setError(null); setData(null);
    const { data: res, error } = await (supabase as any).rpc('get_order_tracking', { _tracking: code.trim() });
    setLoading(false);
    if (error) { setError('Erreur lors de la recherche'); return; }
    if (!res) { setError('Aucun colis trouvé avec ce numéro'); return; }
    setData(res as TrackingData);
  };

  const reset = () => { setCode(''); setData(null); setError(null); };

  const currentIdx = data ? STEPS.findIndex(s => s.key === data.tracking_status) : -1;
  const isNegative = data && NEGATIVE.includes(data.tracking_status);

  return (
    <Dialog open={open} onOpenChange={(o) => { onOpenChange(o); if (!o) reset(); }}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 font-display">
            <Package className="w-5 h-5" /> Suivi de colis
          </DialogTitle>
        </DialogHeader>

        {!data && (
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground">
              Entrez votre code de suivi pour connaître l'état de votre colis.
            </p>
            <div className="flex gap-2">
              <Input
                placeholder="EVC-XXXXXXXX-XXXXXX"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && search()}
                autoFocus
              />
              <Button onClick={search} disabled={loading || !code.trim()}>
                {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                <span className="ml-2 hidden sm:inline">Suivre</span>
              </Button>
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}
          </div>
        )}

        {data && (
          <div className="space-y-6 py-2">
            {/* Header info */}
            <div className="flex items-start justify-between gap-4 pb-4 border-b">
              <div>
                <p className="text-xs uppercase tracking-widest text-muted-foreground">Numéro de suivi</p>
                <p className="font-mono font-medium">{data.tracking_number}</p>
              </div>
              <Badge variant={isNegative ? 'destructive' : data.tracking_status === 'livre' ? 'default' : 'secondary'}>
                {STATUS_LABEL[data.tracking_status]}
              </Badge>
            </div>

            {/* General info */}
            <div className="grid grid-cols-2 gap-4 text-sm">
              <Info label="Commande" value={data.order_number} />
              <Info label="Client" value={data.customer_name} />
              <Info label="Ville" value={data.shipping_city || '—'} />
              <Info label="Créée le" value={fmtDate(data.created_at)} />
              <Info label="Expédiée le" value={fmtDate(data.shipped_at)} />
              <Info label="Livraison estimée" value={fmtDate(data.estimated_delivery_at)} />
              {data.delivered_at && <Info label="Livrée le" value={fmtDate(data.delivered_at)} />}
            </div>

            {/* Financial */}
            <div className="bg-secondary rounded-md p-4 space-y-2 text-sm">
              <div className="flex justify-between"><span className="text-muted-foreground">Montant total</span><span className="font-medium">{fmtDH(data.total)}</span></div>
              <div className="flex justify-between"><span className="text-muted-foreground">Acompte payé</span><span className="font-medium">{fmtDH(data.deposit_amount)}</span></div>
              <div className="flex justify-between pt-2 border-t border-border font-medium">
                <span>Reste à payer à la livraison</span>
                <span className="text-lg">{fmtDH(data.remaining_amount)}</span>
              </div>
            </div>

            {/* Timeline */}
            {!isNegative && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-4">Progression</h4>
                <ol className="relative border-l border-border ml-3 space-y-4">
                  {STEPS.map((step, i) => {
                    const done = i <= currentIdx;
                    const active = i === currentIdx;
                    const Icon = step.icon;
                    const evt = data.events.find(e => e.status === step.key);
                    return (
                      <li key={step.key} className="ml-6">
                        <span className={`absolute -left-3 flex items-center justify-center w-6 h-6 rounded-full ring-4 ring-background ${done ? 'bg-foreground text-background' : 'bg-secondary text-muted-foreground'}`}>
                          <Icon className="w-3 h-3" />
                        </span>
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${done ? 'font-medium' : 'text-muted-foreground'}`}>{step.label}</span>
                          {active && <Badge variant="default" className="text-[10px]">En cours</Badge>}
                        </div>
                        {evt && <p className="text-xs text-muted-foreground mt-0.5">{fmtDT(evt.occurred_at)}</p>}
                      </li>
                    );
                  })}
                </ol>
              </div>
            )}

            {/* History */}
            {data.events.length > 0 && (
              <div>
                <h4 className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Historique</h4>
                <div className="space-y-2">
                  {data.events.map((e, i) => (
                    <div key={i} className="flex gap-3 text-sm border-b last:border-0 pb-2">
                      <span className="text-muted-foreground whitespace-nowrap w-32">{fmtDT(e.occurred_at)}</span>
                      <span className="font-medium">{STATUS_LABEL[e.status]}</span>
                      {e.comment && <span className="text-muted-foreground flex-1">— {e.comment}</span>}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between pt-2">
              <Button variant="outline" onClick={reset}>Suivre un autre colis</Button>
              <Button variant="ghost" onClick={() => onOpenChange(false)}>Fermer</Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wider text-muted-foreground">{label}</p>
      <p className="font-medium">{value}</p>
    </div>
  );
}

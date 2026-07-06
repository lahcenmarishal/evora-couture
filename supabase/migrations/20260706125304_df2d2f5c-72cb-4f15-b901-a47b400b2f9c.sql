-- 1. Add missing column
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_bestseller boolean DEFAULT false;

-- 2. Ensure slug uniqueness for idempotent seed
CREATE UNIQUE INDEX IF NOT EXISTS categories_slug_key ON public.categories(slug);
CREATE UNIQUE INDEX IF NOT EXISTS products_slug_key ON public.products(slug);

-- 3. Seed categories
INSERT INTO public.categories (name, slug, image_url) VALUES
  ('Caftans Traditionnels','caftans-traditionnels','/products/caftan-brun.jpg'),
  ('Caftans Brodés','caftans-brodes','/products/caftan-rose-gold.jpg'),
  ('Occasions','occasions','/products/caftan-argent.jpg'),
  ('Nouvelle Collection','nouvelle-collection','/products/caftan-riad.jpg')
ON CONFLICT (slug) DO NOTHING;

-- 4. Seed products
WITH cat AS (SELECT id, slug FROM public.categories)
INSERT INTO public.products (name, slug, description, price, original_price, category_id, images, is_featured, is_new, is_bestseller) VALUES
  ('Caftan Rose Gold Nuptial','caftan-rose-gold-nuptial','Caftan somptueux en tissu rose gold, entièrement brodé à la main de motifs floraux dorés. Ceinture bijou incluse. Une pièce d''exception pour votre mariage ou vos cérémonies les plus prestigieuses.',3890,4290,(SELECT id FROM cat WHERE slug='caftans-brodes'),ARRAY['/products/caftan-rose-gold.jpg'],true,true,false),
  ('Caftan Velours Brun Doré','caftan-velours-brun-dore','Caftan en velours brun profond avec broderies dorées traditionnelles. Coupe majestueuse rehaussée d''une ceinture bijou finement travaillée. L''incarnation du luxe marocain.',3290,NULL,(SELECT id FROM cat WHERE slug='caftans-traditionnels'),ARRAY['/products/caftan-brun.jpg','/products/caftan-riad.jpg'],true,false,true),
  ('Caftan Signature Riad','caftan-signature-riad','Notre pièce signature inspirée des riads marocains. Velours brun aux broderies or délicates, silhouette élégante et intemporelle pour vos plus belles occasions.',3590,NULL,(SELECT id FROM cat WHERE slug='caftans-traditionnels'),ARRAY['/products/caftan-riad.jpg','/products/caftan-brun.jpg'],true,true,false),
  ('Caftan Bordeaux Prestige','caftan-bordeaux-prestige','Caftan en velours bordeaux avec broderies or et rose. Ceinture bijou en cristal. Une pièce théâtrale qui capture la lumière et sublime la silhouette.',3790,NULL,(SELECT id FROM cat WHERE slug='caftans-brodes'),ARRAY['/products/caftan-bordeaux.jpg'],true,false,true),
  ('Caftan Nuptial Blanc Perlé','caftan-nuptial-blanc-perle','Robe de mariée caftan en dentelle blanche perlée avec voile assorti. Broderies délicates et perles cousues main. La quintessence de l''élégance nuptiale marocaine.',5290,NULL,(SELECT id FROM cat WHERE slug='occasions'),ARRAY['/products/caftan-blanc-mariage.jpg'],true,true,false),
  ('Caftan Argent Cristal','caftan-argent-cristal','Caftan gris argenté orné de cristaux et broderies argent. Coupe majestueuse et ceinture bijou spectaculaire. Pour briller lors de vos plus grands événements.',4590,NULL,(SELECT id FROM cat WHERE slug='occasions'),ARRAY['/products/caftan-argent.jpg'],false,false,true),
  ('Caftan Violet Aristocrate','caftan-violet-aristocrate','Caftan violet et vert avec broderies argentées et perles nacrées. Un jeu de couleurs audacieux pour une allure aristocratique et raffinée.',3390,NULL,(SELECT id FROM cat WHERE slug='caftans-brodes'),ARRAY['/products/caftan-violet.jpg'],false,true,false),
  ('Caftan Violet Fleuri Doré','caftan-violet-fleuri-dore','Caftan violet aux motifs floraux multicolores et broderies dorées luxuriantes. Ceinture bijou dorée assortie. L''exubérance maîtrisée du savoir-faire marocain.',3690,NULL,(SELECT id FROM cat WHERE slug='nouvelle-collection'),ARRAY['/products/caftan-violet-fleuri.jpg'],true,false,false)
ON CONFLICT (slug) DO NOTHING;

-- 5. Seed variants per product
DO $$
DECLARE
  variants jsonb := '[
    {"slug":"caftan-rose-gold-nuptial","color":"Rose Gold","stocks":{"S":3,"M":5,"L":4,"XL":2}},
    {"slug":"caftan-velours-brun-dore","color":"Brun","stocks":{"S":4,"M":6,"L":5,"XL":3}},
    {"slug":"caftan-signature-riad","color":"Brun Doré","stocks":{"S":3,"M":5,"L":4,"XL":2}},
    {"slug":"caftan-bordeaux-prestige","color":"Bordeaux","stocks":{"S":3,"M":4,"L":6,"XL":2}},
    {"slug":"caftan-nuptial-blanc-perle","color":"Blanc Perlé","stocks":{"S":2,"M":3,"L":2,"XL":1}},
    {"slug":"caftan-argent-cristal","color":"Argent","stocks":{"S":2,"M":4,"L":3,"XL":2}},
    {"slug":"caftan-violet-aristocrate","color":"Violet","stocks":{"S":3,"M":5,"L":4,"XL":2}},
    {"slug":"caftan-violet-fleuri-dore","color":"Violet Fleuri","stocks":{"S":3,"M":4,"L":5,"XL":2}}
  ]'::jsonb;
  v jsonb;
  pid uuid;
  sz text;
  qty int;
BEGIN
  FOR v IN SELECT jsonb_array_elements(variants) LOOP
    SELECT id INTO pid FROM public.products WHERE slug = v->>'slug';
    IF pid IS NULL THEN CONTINUE; END IF;
    FOR sz, qty IN SELECT key, value::int FROM jsonb_each_text(v->'stocks') LOOP
      INSERT INTO public.product_variants (product_id, size, color, stock)
      SELECT pid, sz, v->>'color', qty
      WHERE NOT EXISTS (
        SELECT 1 FROM public.product_variants
        WHERE product_id = pid AND size = sz AND color = v->>'color'
      );
    END LOOP;
  END LOOP;
END $$;

-- 6. Ensure public read grants (products are public catalog)
GRANT SELECT ON public.categories TO anon, authenticated;
GRANT SELECT ON public.products TO anon, authenticated;
GRANT SELECT ON public.product_variants TO anon, authenticated;
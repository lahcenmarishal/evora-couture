import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Product } from '@/lib/products';

interface DbVariant {
  size: string;
  color: string;
  stock: number;
}

interface DbProduct {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  images: string[] | null;
  is_featured: boolean | null;
  is_new: boolean | null;
  is_bestseller: boolean | null;
  categories: { slug: string; name: string } | null;
  product_variants: DbVariant[];
}

const map = (p: DbProduct): Product => ({
  id: p.id,
  name: p.name,
  slug: p.slug,
  category: p.categories?.slug || 'nouvelle-collection',
  price: Number(p.price),
  originalPrice: p.original_price ? Number(p.original_price) : undefined,
  description: p.description || '',
  images: p.images && p.images.length > 0 ? p.images : ['/placeholder.svg'],
  variants: (p.product_variants || []).map(v => ({ size: v.size, color: v.color, stock: v.stock })),
  isNew: !!p.is_new,
  isBestseller: !!p.is_bestseller,
  isFeatured: !!p.is_featured,
});

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*, categories(slug, name), product_variants(*)')
        .order('created_at', { ascending: false });
      if (!alive) return;
      if (error) setError(error.message);
      else setProducts((data as unknown as DbProduct[]).map(map));
      setLoading(false);
    })();
    return () => { alive = false; };
  }, []);

  return { products, loading, error };
}

export function useProductBySlug(slug: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let alive = true;
    (async () => {
      setLoading(true);
      const { data } = await supabase
        .from('products')
        .select('*, categories(slug, name), product_variants(*)')
        .eq('slug', slug)
        .maybeSingle();
      if (!alive) return;
      setProduct(data ? map(data as unknown as DbProduct) : null);
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [slug]);

  return { product, loading };
}

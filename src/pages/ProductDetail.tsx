import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Minus, Plus, Heart, Share2, ChevronLeft, Truck, Shield, RotateCcw, MessageCircle } from 'lucide-react';
import { SizeGuide } from '@/components/product/SizeGuide';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductGallery } from '@/components/product/ProductGallery';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useCart } from '@/lib/cart';
import { getProductBySlug, products as localProducts, Product as LocalProduct } from '@/lib/products';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface ProductVariant {
  id: string;
  size: string;
  color: string;
  stock: number;
}

interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  price: number;
  original_price: number | null;
  images: string[] | null;
  is_new: boolean | null;
  is_featured: boolean | null;
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { addItem } = useCart();
  
  const [product, setProduct] = useState<Product | null>(null);
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const fetchProduct = async () => {
    setIsLoading(true);
    try {
      // Try to fetch from Supabase first
      const { data: productData, error: productError } = await supabase
        .from('products')
        .select('*')
        .eq('slug', slug)
        .single();

      if (productError || !productData) {
        // Fallback to local data if not in database
        const localProduct = getProductBySlug(slug || '');
        if (localProduct) {
          setProduct({
            id: localProduct.id,
            name: localProduct.name,
            slug: localProduct.slug,
            description: localProduct.description,
            price: localProduct.price,
            original_price: localProduct.originalPrice || null,
            images: localProduct.images,
            is_new: localProduct.isNew || null,
            is_featured: localProduct.isFeatured || null,
          });
          setVariants(localProduct.variants.map((v, i) => ({
            id: `local-${i}`,
            size: v.size,
            color: v.color,
            stock: v.stock,
          })));
          // Get related from local
          const related = localProducts.filter(p => p.id !== localProduct.id).slice(0, 4);
          setRelatedProducts(related.map(p => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            description: p.description,
            price: p.price,
            original_price: p.originalPrice || null,
            images: p.images,
            is_new: p.isNew || null,
            is_featured: p.isFeatured || null,
          })));
        }
      } else {
        setProduct(productData);

        // Fetch variants
        const { data: variantsData, error: variantsError } = await supabase
          .from('product_variants')
          .select('*')
          .eq('product_id', productData.id);

        if (!variantsError && variantsData) {
          setVariants(variantsData);
          // Set default color
          const colors = [...new Set(variantsData.map(v => v.color))];
          if (colors.length > 0) {
            setSelectedColor(colors[0]);
          }
        }

        // Fetch related products
        const { data: relatedData } = await supabase
          .from('products')
          .select('*')
          .neq('id', productData.id)
          .limit(4);

        if (relatedData) {
          setRelatedProducts(relatedData);
        }
      }
    } catch (error) {
      console.error('Error fetching product:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen">
        <Header />
        <main className="pt-20 lg:pt-24">
          <div className="container-fashion py-4">
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="container-fashion pb-20">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
              <Skeleton className="aspect-fashion" />
              <div className="space-y-6 lg:py-8">
                <Skeleton className="h-10 w-3/4" />
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-24 w-full" />
                <Skeleton className="h-12 w-full" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center space-y-4">
            <p className="text-xl text-muted-foreground">Produit non trouvé</p>
            <Link to="/collection" className="btn-premium inline-flex">
              Voir la collection
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const sizes = [...new Set(variants.map(v => v.size))];
  const colors = [...new Set(variants.map(v => v.color))];
  const selectedVariant = variants.find(
    v => v.size === selectedSize && v.color === selectedColor
  );
  const inStock = selectedVariant ? selectedVariant.stock > 0 : variants.length === 0;

  const handleAddToCart = () => {
    if (sizes.length > 0 && !selectedSize) {
      toast.error('Veuillez sélectionner une taille');
      return;
    }
    
    const cartProduct = {
      id: product.id,
      name: product.name,
      slug: product.slug,
      category: 'caftans',
      price: product.price,
      originalPrice: product.original_price || undefined,
      images: product.images || [],
      description: product.description || '',
      variants: variants.map(v => ({
        size: v.size,
        color: v.color,
        stock: v.stock,
      })),
    };
    
    addItem(cartProduct, selectedSize || 'Unique', selectedColor || 'Standard', quantity);
    toast.success('Ajouté au panier');
  };

  // Format related products for ProductGrid
  const formattedRelated = relatedProducts.map(p => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    category: 'caftans',
    price: p.price,
    originalPrice: p.original_price || undefined,
    images: p.images || [],
    description: p.description || '',
    variants: [],
  }));

  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />

      <main className="pt-20 lg:pt-24">
        {/* Breadcrumb */}
        <div className="container-fashion py-4">
          <Link to="/collection" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ChevronLeft className="w-4 h-4" />
            Retour à la collection
          </Link>
        </div>

        <div className="container-fashion pb-20">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Gallery */}
            <motion.div 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }}
            >
              <ProductGallery 
                images={product.images || []} 
                productName={product.name} 
              />
            </motion.div>

            {/* Product Info */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }} 
              animate={{ opacity: 1, x: 0 }} 
              transition={{ delay: 0.1 }} 
              className="lg:py-8"
            >
              {/* Title & Price */}
              <div className="mb-8">
                {product.is_new && (
                  <span className="inline-block text-caption text-primary mb-3">Nouveauté</span>
                )}
                <h1 className="text-title mb-4">{product.name}</h1>
                <div className="flex items-center gap-4">
                  <span className="text-2xl font-light">{product.price.toFixed(2)} MAD</span>
                  {product.original_price && (
                    <span className="text-lg text-muted-foreground line-through">
                      {product.original_price.toFixed(2)} MAD
                    </span>
                  )}
                </div>
              </div>

              {/* Color Selector */}
              {colors.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-caption mb-4">
                    Couleur: <span className="text-foreground font-normal normal-case tracking-normal">{selectedColor}</span>
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => (
                      <button 
                        key={color} 
                        onClick={() => setSelectedColor(color)} 
                        className={`px-5 py-2.5 border text-sm transition-all duration-300 ${
                          selectedColor === color 
                            ? 'border-foreground bg-foreground text-background' 
                            : 'border-border hover:border-foreground'
                        }`}
                      >
                        {color}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Size Selector */}
              {sizes.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-caption">Taille</h3>
                    <SizeGuide 
                      selectedSize={selectedSize} 
                      onSizeSelect={setSelectedSize} 
                    />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => {
                      const variant = variants.find(v => v.size === size && v.color === selectedColor);
                      const available = variant ? variant.stock > 0 : false;
                      return (
                        <button 
                          key={size} 
                          onClick={() => setSelectedSize(size)} 
                          disabled={!available} 
                          className={`min-w-[48px] h-12 px-4 border text-sm transition-all duration-300 ${
                            selectedSize === size 
                              ? 'border-foreground bg-foreground text-background' 
                              : available 
                                ? 'border-border hover:border-foreground' 
                                : 'border-border text-muted-foreground line-through cursor-not-allowed opacity-50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <h3 className="text-caption mb-4">Quantité</h3>
                <div className="flex items-center border border-border w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))} 
                    className="qty-btn"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-16 text-center font-medium">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)} 
                    className="qty-btn"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4 mb-10">
                <button 
                  onClick={handleAddToCart} 
                  disabled={!inStock} 
                  className="w-full py-4 bg-foreground text-background text-caption hover:bg-foreground/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {inStock ? 'Ajouter au panier' : 'Rupture de stock'}
                </button>
                <div className="flex gap-4">
                  <button className="flex-1 py-4 border border-border text-caption hover:bg-muted transition-colors flex items-center justify-center gap-2">
                    <Heart className="w-4 h-4" />
                    Favoris
                  </button>
                  <button className="flex-1 py-4 border border-border text-caption hover:bg-muted transition-colors flex items-center justify-center gap-2">
                    <Share2 className="w-4 h-4" />
                    Partager
                  </button>
                </div>
              </div>

              {/* Features */}
              <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-border mb-8">
                <div className="text-center">
                  <Truck className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Livraison offerte</p>
                </div>
                <div className="text-center">
                  <Shield className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Paiement sécurisé</p>
                </div>
                <div className="text-center">
                  <RotateCcw className="w-5 h-5 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Retours gratuits</p>
                </div>
              </div>

              {/* Description Accordion */}
              <Accordion type="single" collapsible defaultValue="description">
                <AccordionItem value="description" className="border-border">
                  <AccordionTrigger className="text-caption hover:no-underline">
                    Description
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground">
                      {product.description ? (
                        <p className="text-body leading-relaxed whitespace-pre-line">
                          {product.description}
                        </p>
                      ) : (
                        <p className="text-body leading-relaxed">
                          Cette pièce incarne l'élégance intemporelle de EVORA COUTURE. 
                          Confectionnée avec soin dans notre atelier, elle allie tradition 
                          marocaine et design contemporain. Un choix raffiné pour sublimer 
                          votre silhouette au quotidien comme pour les occasions spéciales.
                        </p>
                      )}
                    </div>
                  </AccordionContent>
                </AccordionItem>
                
                <AccordionItem value="details" className="border-border">
                  <AccordionTrigger className="text-caption hover:no-underline">
                    Détails & Composition
                  </AccordionTrigger>
                  <AccordionContent>
                    <ul className="space-y-2 text-body text-muted-foreground">
                      <li>• Tissu premium de haute qualité</li>
                      <li>• Broderies artisanales faites main</li>
                      <li>• Coupe fluide et confortable</li>
                      <li>• Finitions soignées</li>
                      <li>• Lavage délicat recommandé</li>
                    </ul>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="shipping" className="border-border">
                  <AccordionTrigger className="text-caption hover:no-underline">
                    Livraison & Retours
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="space-y-4 text-body text-muted-foreground">
                      <p>
                        <strong className="text-foreground">Livraison gratuite</strong> pour toute commande au Maroc.
                        Délai de livraison : 2-5 jours ouvrés.
                      </p>
                      <p>
                        <strong className="text-foreground">Retours gratuits</strong> sous 14 jours.
                        Les articles doivent être retournés dans leur état d'origine.
                      </p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </motion.div>
          </div>
        </div>

        {/* Related Products */}
        {formattedRelated.length > 0 && (
          <section className="py-20 bg-secondary">
            <div className="container-fashion">
              <motion.h2 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-title text-center mb-12"
              >
                Vous aimerez aussi
              </motion.h2>
              <ProductGrid products={formattedRelated} />
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

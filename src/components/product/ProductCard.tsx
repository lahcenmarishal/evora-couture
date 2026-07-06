import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Product } from '@/lib/products';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.originalPrice && product.originalPrice > product.price;
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="product-card group"
    >
      <Link to={`/produit/${product.slug}`}>
        {/* Image */}
        <div className="relative aspect-fashion bg-muted overflow-hidden mb-4">
          <img
            src={product.images[0]}
            alt={product.name}
            className="product-image w-full h-full object-cover transition-transform duration-700"
          />
          
          {/* Badges */}
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew && (
              <span className="px-3 py-1 bg-foreground text-background text-[10px] uppercase tracking-widest">
                Nouveau
              </span>
            )}
            {hasDiscount && (
              <span className="px-3 py-1 bg-sale text-background text-[10px] uppercase tracking-widest">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Quick add - appears on hover */}
          <div className="absolute bottom-0 left-0 right-0 p-4 opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
            <button className="w-full py-3 bg-background text-foreground text-caption hover:bg-foreground hover:text-background transition-colors">
              Aperçu rapide
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="space-y-2">
          <h3 className="text-sm font-medium tracking-wide line-clamp-1">
            {product.name}
          </h3>
          <div className="flex items-center gap-2">
            <span className="text-sm">{product.price.toLocaleString('fr-MA')} DH</span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
                {product.originalPrice!.toLocaleString('fr-MA')} DH
              </span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

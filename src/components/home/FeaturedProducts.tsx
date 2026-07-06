import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import caftanRoseGold from '@/assets/caftan-rose-gold.jpg';
import caftanRiad from '@/assets/caftan-riad.jpg';
import caftanBordeaux from '@/assets/caftan-bordeaux.jpg';
import caftanArgent from '@/assets/caftan-argent.jpg';

interface FeaturedProduct {
  id: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  collection: string;
}

const featuredProducts: FeaturedProduct[] = [
  {
    id: '1',
    name: 'Caftan Rose Gold Nuptial',
    slug: 'caftan-rose-gold-nuptial',
    price: 3890,
    image: caftanRoseGold,
    collection: 'Brodés',
  },
  {
    id: '3',
    name: 'Caftan Signature Riad',
    slug: 'caftan-signature-riad',
    price: 3590,
    image: caftanRiad,
    collection: 'Traditionnels',
  },
  {
    id: '4',
    name: 'Caftan Bordeaux Prestige',
    slug: 'caftan-bordeaux-prestige',
    price: 3790,
    image: caftanBordeaux,
    collection: 'Brodés',
  },
  {
    id: '6',
    name: 'Caftan Argent Cristal',
    slug: 'caftan-argent-cristal',
    price: 4590,
    image: caftanArgent,
    collection: 'Occasions',
  },
];

export function FeaturedProducts() {
  return (
    <section className="py-24 lg:py-36 bg-secondary">
      <div className="container-fashion">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="flex flex-col sm:flex-row sm:items-end justify-between gap-8 mb-16"
        >
          <div>
            <span className="text-caption text-muted-foreground mb-4 block">
              Sélection
            </span>
            <h2 className="text-title">Pièces Signature</h2>
          </div>
          <Link
            to="/collection"
            className="inline-flex items-center gap-3 text-caption link-underline group"
          >
            Voir toute la collection
            <ArrowRight className="w-4 h-4 transition-transform duration-500 group-hover:translate-x-2" />
          </Link>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
          {featuredProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
            >
              <Link to={`/produit/${product.slug}`} className="group block">
                <div className="relative aspect-fashion overflow-hidden mb-5">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-500" />
                </div>
                <div className="space-y-2">
                  <span className="text-caption text-muted-foreground block">
                    {product.collection}
                  </span>
                  <h3 className="text-body font-medium group-hover:text-muted-foreground transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-body text-muted-foreground">
                    {product.price.toLocaleString('fr-MA')} DH
                  </p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import collectionTraditionnels from '@/assets/caftan-riad.jpg';
import collectionOccasions from '@/assets/caftan-blanc-mariage.jpg';

export function CollectionsSection() {
  return (
    <section className="section-editorial">
      <div className="container-fashion">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-caption text-muted-foreground mb-6 block">
            Nos Collections
          </span>
          <h2 className="text-title max-w-2xl mx-auto">
            Deux univers, une même quête d'élégance
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1, duration: 0.8 }}
          >
            <Link to="/collection/caftans-traditionnels" className="group block">
              <div className="relative aspect-editorial overflow-hidden mb-8">
                <img
                  src={collectionTraditionnels}
                  alt="Collection Caftans Traditionnels"
                  className="w-full h-full object-cover editorial-image"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-caption text-white/70 mb-2 block">Collection</span>
                  <h3 className="text-subtitle text-white">Caftans Traditionnels</h3>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-body text-muted-foreground max-w-sm">
                  Velours nobles et broderies dorées ancestrales, l'essence du raffinement marocain
                </p>
                <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-3" />
              </div>
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8 }}
          >
            <Link to="/collection/occasions" className="group block">
              <div className="relative aspect-editorial overflow-hidden mb-8">
                <img
                  src={collectionOccasions}
                  alt="Collection Occasions"
                  className="w-full h-full object-cover editorial-image"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/50 to-transparent">
                  <span className="text-caption text-white/70 mb-2 block">Collection</span>
                  <h3 className="text-subtitle text-white">Occasions & Mariage</h3>
                </div>
              </div>
              <div className="flex items-center justify-between px-1">
                <p className="text-body text-muted-foreground max-w-sm">
                  Pièces d'exception pour vos moments les plus précieux et vos cérémonies
                </p>
                <ArrowRight className="w-5 h-5 transition-transform duration-500 group-hover:translate-x-3" />
              </div>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

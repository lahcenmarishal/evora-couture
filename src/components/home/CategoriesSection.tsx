import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import caftanRiad from '@/assets/caftan-riad.jpg';
import caftanRoseGold from '@/assets/caftan-rose-gold.jpg';
import caftanBrun from '@/assets/caftan-brun.jpg';

export function CategoriesSection() {
  return (
    <section className="section-editorial overflow-hidden">
      <div className="container-fashion">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-20"
        >
          <span className="text-caption text-muted-foreground mb-6 block">
            L'Art du Caftan
          </span>
          <h2 className="text-title max-w-3xl mx-auto">
            Un savoir-faire artisanal transmis de génération en génération
          </h2>
        </motion.div>

        <div className="grid lg:grid-cols-12 gap-6 lg:gap-10">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="lg:col-span-7"
          >
            <Link to="/collection" className="group block">
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={caftanRiad}
                  alt="Caftan artisanal"
                  className="w-full h-full object-cover editorial-image"
                />
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700" />
                <div className="absolute bottom-0 left-0 right-0 p-10 bg-gradient-to-t from-black/60 via-black/30 to-transparent">
                  <span className="text-caption text-white/70 mb-3 block">Artisanat</span>
                  <h3 className="text-subtitle text-white mb-3">Broderies à la Main</h3>
                  <p className="text-body text-white/70 max-w-md">
                    Chaque caftan raconte une histoire, celle des artisanes marocaines qui perpétuent un art séculaire.
                  </p>
                </div>
              </div>
            </Link>
          </motion.div>

          <div className="lg:col-span-5 flex flex-col gap-6 lg:gap-10">
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1, duration: 0.8 }}
              className="flex-1"
            >
              <Link to="/collection" className="group block h-full">
                <div className="relative h-full min-h-[300px] overflow-hidden">
                  <img
                    src={caftanRoseGold}
                    alt="Détail broderie caftan"
                    className="w-full h-full object-cover editorial-image"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-caption text-white/70 mb-2 block">Détails</span>
                    <h3 className="text-lg font-display text-white">Finitions Précieuses</h3>
                  </div>
                </div>
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="flex-1"
            >
              <Link to="/collection" className="group block h-full">
                <div className="relative h-full min-h-[300px] overflow-hidden">
                  <img
                    src={caftanBrun}
                    alt="Lifestyle caftan"
                    className="w-full h-full object-cover editorial-image"
                  />
                  <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700" />
                  <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                    <span className="text-caption text-white/70 mb-2 block">Lifestyle</span>
                    <h3 className="text-lg font-display text-white">L'Élégance en Héritage</h3>
                  </div>
                </div>
              </Link>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';
import caftanRoseGold from '@/assets/caftan-rose-gold.jpg';
import caftanBrun from '@/assets/caftan-brun.jpg';
import caftanRiad from '@/assets/caftan-riad.jpg';
import caftanBordeaux from '@/assets/caftan-bordeaux.jpg';
import caftanBlanc from '@/assets/caftan-blanc-mariage.jpg';
import caftanArgent from '@/assets/caftan-argent.jpg';

const instagramPosts = [
  { id: 1, image: caftanRoseGold },
  { id: 2, image: caftanBrun },
  { id: 3, image: caftanRiad },
  { id: 4, image: caftanBordeaux },
  { id: 5, image: caftanBlanc },
  { id: 6, image: caftanArgent },
];

export function InstagramFeed() {
  return (
    <section className="py-24 lg:py-32">
      <div className="container-fashion">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <a
            href="https://instagram.com/evoracouture"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-4 text-caption link-underline group"
          >
            <Instagram className="w-5 h-5" />
            <span>Suivez-nous @evoracouture</span>
          </a>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
          {instagramPosts.map((post, index) => (
            <motion.a
              key={post.id}
              href="https://instagram.com/evoracouture"
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05, duration: 0.5 }}
              className="relative aspect-square overflow-hidden group"
            >
              <img
                src={post.image}
                alt="EVORA COUTURE sur Instagram"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/40 transition-colors duration-500 flex items-center justify-center">
                <Instagram className="w-7 h-7 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function BrandStory() {
  return (
    <section className="py-28 lg:py-44 bg-primary text-primary-foreground">
      <div className="container-fashion">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
          >
            <span className="text-caption text-primary-foreground/60 mb-8 block">
              Notre Philosophie
            </span>

            <h2 className="text-title mb-10 leading-tight">
              L'Héritage Réinventé
            </h2>

            <p className="text-editorial text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              « Nous croyons en une mode qui transcende les frontières,
              où le caftan marocain devient une pièce universelle d'élégance. »
            </p>

            <p className="text-body text-primary-foreground/60 mb-12 max-w-xl mx-auto leading-relaxed">
              EVORA COUTURE réunit le meilleur du savoir-faire marocain et une esthétique résolument moderne.
              Chaque caftan est pensé pour la femme d'aujourd'hui : confiante, raffinée, audacieuse.
            </p>

            <motion.div
              initial={{ scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.8 }}
              className="w-32 h-px bg-primary-foreground/20 mx-auto mb-12"
            />

            <Link
              to="/a-propos"
              className="inline-flex items-center gap-3 text-caption text-primary-foreground/80 
                         hover:text-primary-foreground transition-colors group link-underline"
            >
              Découvrir notre histoire
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

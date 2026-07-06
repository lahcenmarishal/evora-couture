import { Link } from 'react-router-dom';
import { Instagram, Facebook, Mail } from 'lucide-react';
import logoEvora from '@/assets/logo-evora.png';

const footerLinks = {
  aide: [
    { name: 'FAQ', href: '/faq' },
    { name: 'Livraison & Retours', href: '/livraison' },
    { name: 'Guide des Tailles', href: '/guide-tailles' },
    { name: 'Contact', href: '/contact' },
  ],
  collections: [
    { name: 'Nouvelle Collection', href: '/collection' },
    { name: 'Sable & Écru', href: '/collection/sable' },
    { name: 'Bleu Nuit', href: '/collection/bleu-nuit' },
    { name: 'Sur-Mesure', href: '/sur-mesure' },
  ],
  informations: [
    { name: 'Notre Histoire', href: '/a-propos' },
    { name: 'Savoir-Faire', href: '/savoir-faire' },
    { name: 'Politique de confidentialité', href: '/confidentialite' },
    { name: 'Mentions légales', href: '/mentions-legales' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container-fashion py-20 lg:py-28">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="inline-block mb-8">
              <img 
                src={logoEvora} 
                alt="EVORA COUTURE" 
                className="h-20 lg:h-24 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-body text-primary-foreground/60 mb-8 max-w-sm leading-relaxed">
              L'art de l'caftan marocaine sublimé par une vision contemporaine. 
              Élégance intemporelle pour la femme moderne.
            </p>
            <div className="flex gap-3">
              <a
                href="https://instagram.com/evoracouture"
                target="_blank"
                rel="noopener noreferrer"
                className="w-11 h-11 flex items-center justify-center border border-primary-foreground/20 
                           hover:bg-primary-foreground hover:text-primary transition-all duration-300"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-11 h-11 flex items-center justify-center border border-primary-foreground/20 
                           hover:bg-primary-foreground hover:text-primary transition-all duration-300"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="mailto:contact@evoracouture.com"
                className="w-11 h-11 flex items-center justify-center border border-primary-foreground/20 
                           hover:bg-primary-foreground hover:text-primary transition-all duration-300"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Collections */}
          <div>
            <h3 className="text-caption mb-8">Collections</h3>
            <ul className="space-y-4">
              {footerLinks.collections.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Aide */}
          <div>
            <h3 className="text-caption mb-8">Aide</h3>
            <ul className="space-y-4">
              {footerLinks.aide.map((link) => (
                <li key={link.name}>
                  <Link
                    to={link.href}
                    className="text-sm text-primary-foreground/60 hover:text-primary-foreground transition-colors duration-300"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-caption mb-8">Newsletter</h3>
            <p className="text-sm text-primary-foreground/60 mb-6 leading-relaxed">
              Recevez en avant-première nos nouvelles collections et offres exclusives.
            </p>
            <form className="space-y-3">
              <input
                type="email"
                placeholder="Votre email"
                className="w-full px-5 py-4 bg-transparent border border-primary-foreground/20 text-sm 
                           placeholder:text-primary-foreground/40 focus:outline-none focus:border-primary-foreground/50
                           transition-colors duration-300"
              />
              <button
                type="submit"
                className="w-full px-5 py-4 bg-primary-foreground text-primary text-caption 
                           hover:bg-primary-foreground/90 transition-colors duration-300"
              >
                S'inscrire
              </button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-20 pt-10 border-t border-primary-foreground/10 flex flex-col sm:flex-row justify-between items-center gap-6">
          <p className="text-xs text-primary-foreground/40">
            © 2025 EVORA COUTURE. Tous droits réservés.
          </p>
          <div className="flex gap-8">
            {footerLinks.informations.slice(2).map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-xs text-primary-foreground/40 hover:text-primary-foreground/60 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

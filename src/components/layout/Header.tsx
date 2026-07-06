import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, Search, ChevronDown, Package, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/lib/cart';
import { useAuth } from '@/hooks/useAuth';
import logoEvora from '@/assets/logo-evora.png';
import { TrackingDialog } from '@/components/tracking/TrackingDialog';

const navStructure = [
  { name: 'New In', href: '/collection/new-in' },
  { 
    name: 'Caftans', 
    href: '/collection/caftans',
    subcategories: [
      { name: 'Traditionnelles', href: '/collection/caftans-traditionnelles' },
      { name: 'Modernes', href: '/collection/caftans-modernes' },
      { name: 'Brodées', href: '/collection/caftans-brodees' },
      { name: 'Minimalistes', href: '/collection/caftans-minimalistes' },
    ]
  },
  { 
    name: 'Occasions', 
    href: '/collection/occasions',
    subcategories: [
      { name: 'Eid', href: '/collection/occasions-eid' },
      { name: 'Soirées', href: '/collection/occasions-soirees' },
      { name: 'Cérémonies', href: '/collection/occasions-ceremonies' },
    ]
  },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [mobileOpenSub, setMobileOpenSub] = useState<string | null>(null);
  const [trackingOpen, setTrackingOpen] = useState(false);
  const { getTotalItems, openCart } = useCart();
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const totalItems = getTotalItems();

  const handleAccountClick = () => {
    if (user && isAdmin) navigate('/admin');
    else navigate('/admin/login');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
      <div className="container-fashion">
        <div className="grid grid-cols-3 items-center h-16 lg:h-20">
          {/* Left: Mobile menu button / Desktop navigation */}
          <div className="flex items-center justify-start">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="lg:hidden p-2 -ml-2 text-white"
              aria-label="Menu"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center gap-6">
              {navStructure.map((item) => (
                <div
                  key={item.name}
                  className="relative"
                  onMouseEnter={() => item.subcategories && setOpenDropdown(item.name)}
                  onMouseLeave={() => setOpenDropdown(null)}
                >
                  <Link
                    to={item.href}
                    className="text-caption link-underline text-white/80 hover:text-white transition-colors whitespace-nowrap flex items-center gap-1"
                  >
                    {item.name}
                    {item.subcategories && <ChevronDown className="w-3 h-3" />}
                  </Link>
                  
                  {/* Desktop Dropdown */}
                  {item.subcategories && openDropdown === item.name && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 10 }}
                      className="absolute top-full left-0 mt-2 bg-black/95 backdrop-blur-md border border-white/10 rounded-md py-2 min-w-[180px]"
                    >
                      {item.subcategories.map((sub) => (
                        <Link
                          key={sub.name}
                          to={sub.href}
                          className="block px-4 py-2 text-sm text-white/80 hover:text-white hover:bg-white/5 transition-colors"
                        >
                          {sub.name}
                        </Link>
                      ))}
                    </motion.div>
                  )}
                </div>
              ))}
            </nav>
          </div>

          {/* Center: Logo */}
          <div className="flex items-center justify-center">
            <Link to="/">
              <img 
                src={logoEvora} 
                alt="EVORA COUTURE" 
                className="h-14 lg:h-20 w-auto"
              />
            </Link>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center justify-end gap-2 sm:gap-4 text-white">
            <button className="p-2 hidden sm:block hover:text-white/80 transition-colors" aria-label="Rechercher">
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setTrackingOpen(true)}
              className="p-2 hover:text-white/80 transition-colors"
              aria-label="Suivi de colis"
              title="Suivi de colis"
            >
              <Package className="w-5 h-5" />
            </button>
            <button
              onClick={handleAccountClick}
              className="p-2 hover:text-white/80 transition-colors"
              aria-label="Compte"
              title={user && isAdmin ? 'Admin' : 'Connexion'}
            >
              <User className="w-5 h-5" />
            </button>
            <button
              onClick={openCart}
              className="p-2 relative hover:text-white/80 transition-colors"
              aria-label="Panier"
            >
              <ShoppingBag className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-white text-black text-[10px] flex items-center justify-center rounded-full">
                  {totalItems}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden border-t border-white/10 overflow-hidden bg-black"
          >
            <nav className="container-fashion py-6 flex flex-col gap-2">
              {navStructure.map((item, index) => (
                <motion.div
                  key={item.name}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  {item.subcategories ? (
                    <div>
                      <button
                        onClick={() => setMobileOpenSub(mobileOpenSub === item.name ? null : item.name)}
                        className="text-caption flex items-center justify-between w-full py-2 text-white"
                      >
                        {item.name}
                        <ChevronDown className={`w-4 h-4 transition-transform ${mobileOpenSub === item.name ? 'rotate-180' : ''}`} />
                      </button>
                      <AnimatePresence>
                        {mobileOpenSub === item.name && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="pl-4 overflow-hidden"
                          >
                            <Link
                              to={item.href}
                              onClick={() => setIsMenuOpen(false)}
                              className="block py-2 text-sm text-white/70 hover:text-white"
                            >
                              Tout voir
                            </Link>
                            {item.subcategories.map((sub) => (
                              <Link
                                key={sub.name}
                                to={sub.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="block py-2 text-sm text-white/70 hover:text-white"
                              >
                                {sub.name}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ) : (
                    <Link
                      to={item.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-caption block py-2 text-white"
                    >
                      {item.name}
                    </Link>
                  )}
                </motion.div>
              ))}
              <div className="flex gap-4 pt-4 border-t border-white/10 text-white">
                <Link to="/recherche" className="text-caption">Rechercher</Link>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
      <TrackingDialog open={trackingOpen} onOpenChange={setTrackingOpen} />
    </header>
  );
}

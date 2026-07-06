import { Link } from 'react-router-dom';
import { X, Plus, Minus, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart, CartItem } from '@/lib/cart';

function CartItemRow({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <motion.div
      layout
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="flex gap-4 py-6 border-b border-border"
    >
      <div className="w-20 h-28 bg-muted overflow-hidden">
        <img
          src={item.product.images[0]}
          alt={item.product.name}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-start">
          <div>
            <h4 className="text-sm font-medium">{item.product.name}</h4>
            <p className="text-xs text-muted-foreground mt-1">
              {item.size} / {item.color}
            </p>
          </div>
          <button
            onClick={() => removeItem(item.product.id, item.size, item.color)}
            className="p-1 hover:bg-muted transition-colors"
            aria-label="Supprimer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center border border-border">
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.size, item.color, item.quantity - 1)
              }
              className="qty-btn"
              aria-label="Diminuer"
            >
              <Minus className="w-3 h-3" />
            </button>
            <span className="w-10 text-center text-sm">{item.quantity}</span>
            <button
              onClick={() =>
                updateQuantity(item.product.id, item.size, item.color, item.quantity + 1)
              }
              className="qty-btn"
              aria-label="Augmenter"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
          <p className="text-sm font-medium">
            {(item.product.price * item.quantity).toFixed(2)} €
          </p>
        </div>
      </div>
    </motion.div>
  );
}

export function CartDrawer() {
  const { items, isOpen, closeCart, getTotalPrice } = useCart();
  const totalPrice = getTotalPrice();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-foreground/20 z-50"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-background z-50 flex flex-col shadow-medium"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-border">
              <h2 className="text-subtitle">Panier ({items.length})</h2>
              <button
                onClick={closeCart}
                className="p-2 hover:bg-muted transition-colors"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-auto px-6">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <ShoppingBag className="w-12 h-12 text-muted-foreground mb-4" />
                  <p className="text-body text-muted-foreground">
                    Votre panier est vide
                  </p>
                  <button
                    onClick={closeCart}
                    className="mt-6 text-caption link-underline"
                  >
                    Continuer mes achats
                  </button>
                </div>
              ) : (
                <AnimatePresence mode="popLayout">
                  {items.map((item) => (
                    <CartItemRow
                      key={`${item.product.id}-${item.size}-${item.color}`}
                      item={item}
                    />
                  ))}
                </AnimatePresence>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="p-6 border-t border-border">
                <div className="flex justify-between items-center mb-6">
                  <span className="text-body">Sous-total</span>
                  <span className="text-subtitle">{totalPrice.toFixed(2)} €</span>
                </div>
                <p className="text-xs text-muted-foreground mb-6">
                  Frais de livraison calculés à l'étape suivante
                </p>
                <Link
                  to="/checkout"
                  onClick={closeCart}
                  className="block w-full py-4 bg-foreground text-background text-center text-caption hover:bg-foreground/90 transition-colors"
                >
                  Commander
                </Link>
                <button
                  onClick={closeCart}
                  className="block w-full py-4 text-center text-caption mt-2"
                >
                  Continuer mes achats
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

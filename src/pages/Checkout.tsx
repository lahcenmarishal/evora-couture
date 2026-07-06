import { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { useCart } from '@/lib/cart';
import { toast } from 'sonner';

export default function Checkout() {
  const { items, getTotalPrice, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cod');

  const subtotal = getTotalPrice();
  const shipping = subtotal > 100 ? 0 : 7.90;
  const total = subtotal + shipping;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Commande confirmée ! Vous recevrez un email de confirmation.');
    clearCart();
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen">
        <Header /><CartDrawer />
        <main className="pt-32 pb-20">
          <div className="container-fashion text-center">
            <h1 className="text-title mb-6">Votre panier est vide</h1>
            <Link to="/collection" className="inline-flex items-center gap-2 px-8 py-4 bg-foreground text-background text-caption">Continuer mes achats</Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <Header /><CartDrawer />
      <main className="pt-20 lg:pt-24">
        <div className="container-fashion py-4">
          <Link to="/collection" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><ChevronLeft className="w-4 h-4" />Continuer mes achats</Link>
        </div>

        <div className="container-fashion pb-20">
          <h1 className="text-title mb-12">Checkout</h1>
          <form onSubmit={handleSubmit}>
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
              <div className="space-y-10">
                <section>
                  <h2 className="text-subtitle mb-6">Contact</h2>
                  <div className="space-y-4">
                    <input type="email" placeholder="Email" required className="w-full px-4 py-4 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors" />
                    <input type="tel" placeholder="Téléphone" required className="w-full px-4 py-4 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors" />
                  </div>
                </section>
                <section>
                  <h2 className="text-subtitle mb-6">Livraison</h2>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Prénom" required className="w-full px-4 py-4 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors" />
                      <input type="text" placeholder="Nom" required className="w-full px-4 py-4 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                    <input type="text" placeholder="Adresse" required className="w-full px-4 py-4 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors" />
                    <div className="grid grid-cols-2 gap-4">
                      <input type="text" placeholder="Code postal" required className="w-full px-4 py-4 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors" />
                      <input type="text" placeholder="Ville" required className="w-full px-4 py-4 border border-border bg-transparent text-sm focus:outline-none focus:border-foreground transition-colors" />
                    </div>
                  </div>
                </section>
                <section>
                  <h2 className="text-subtitle mb-6">Paiement</h2>
                  <div className="space-y-3">
                    <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === 'cod' ? 'border-foreground bg-muted' : 'border-border hover:border-foreground/50'}`}>
                      <input type="radio" name="payment" value="cod" checked={paymentMethod === 'cod'} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-foreground' : 'border-muted-foreground'}`}>{paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-foreground" />}</div>
                      <div><p className="text-sm font-medium">Paiement à la livraison</p><p className="text-xs text-muted-foreground">Payez en espèces à la réception</p></div>
                    </label>
                    <label className={`flex items-center gap-4 p-4 border cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-foreground bg-muted' : 'border-border hover:border-foreground/50'}`}>
                      <input type="radio" name="payment" value="card" checked={paymentMethod === 'card'} onChange={(e) => setPaymentMethod(e.target.value)} className="sr-only" />
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'card' ? 'border-foreground' : 'border-muted-foreground'}`}>{paymentMethod === 'card' && <div className="w-2 h-2 rounded-full bg-foreground" />}</div>
                      <div><p className="text-sm font-medium">Carte bancaire</p><p className="text-xs text-muted-foreground">Visa, Mastercard, CB</p></div>
                    </label>
                  </div>
                </section>
              </div>

              <div>
                <div className="bg-secondary p-6 lg:p-8 sticky top-32">
                  <h2 className="text-subtitle mb-6">Récapitulatif</h2>
                  <div className="space-y-4 mb-6">
                    {items.map((item) => (
                      <motion.div key={`${item.product.id}-${item.size}-${item.color}`} layout className="flex gap-4">
                        <div className="w-16 h-20 bg-muted overflow-hidden"><img src={item.product.images[0]} alt={item.product.name} className="w-full h-full object-cover" /></div>
                        <div className="flex-1"><p className="text-sm font-medium">{item.product.name}</p><p className="text-xs text-muted-foreground">{item.size} / {item.color} × {item.quantity}</p></div>
                        <p className="text-sm">{(item.product.price * item.quantity).toFixed(2)} €</p>
                      </motion.div>
                    ))}
                  </div>
                  <div className="flex gap-2 mb-6">
                    <input type="text" placeholder="Code promo" value={promoCode} onChange={(e) => setPromoCode(e.target.value)} className="flex-1 px-4 py-3 border border-border bg-background text-sm focus:outline-none focus:border-foreground transition-colors" />
                    <button type="button" className="px-6 py-3 bg-foreground text-background text-caption">Appliquer</button>
                  </div>
                  <div className="space-y-3 border-t border-border pt-6">
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Sous-total</span><span>{subtotal.toFixed(2)} €</span></div>
                    <div className="flex justify-between text-sm"><span className="text-muted-foreground">Livraison</span><span>{shipping === 0 ? 'Gratuite' : `${shipping.toFixed(2)} €`}</span></div>
                    <div className="flex justify-between text-lg font-medium pt-3 border-t border-border"><span>Total</span><span>{total.toFixed(2)} €</span></div>
                  </div>
                  <button type="submit" className="w-full py-4 bg-foreground text-background text-caption hover:bg-foreground/90 transition-colors mt-8">Confirmer la commande</button>
                  {shipping > 0 && <p className="text-xs text-muted-foreground text-center mt-4">Livraison gratuite à partir de 100 €</p>}
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}

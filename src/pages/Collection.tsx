import { useState } from 'react';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { ProductGrid } from '@/components/product/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

const sizes = ['XS', 'S', 'M', 'L', 'XL'];
const colors = ['Écru', 'Sable', 'Beige', 'Ivoire', 'Bleu Nuit'];
const sortOptions = [
  { label: 'Nouveautés', value: 'new' },
  { label: 'Prix croissant', value: 'price-asc' },
  { label: 'Prix décroissant', value: 'price-desc' },
];

export default function Collection() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('new');
  const { products, loading } = useProducts();

  const toggleSize = (size: string) => setSelectedSizes(prev => prev.includes(size) ? prev.filter(s => s !== size) : [...prev, size]);
  const toggleColor = (color: string) => setSelectedColors(prev => prev.includes(color) ? prev.filter(c => c !== color) : [...prev, color]);
  const clearFilters = () => { setSelectedSizes([]); setSelectedColors([]); };
  const hasFilters = selectedSizes.length > 0 || selectedColors.length > 0;

  let sortedProducts = [...products];
  if (sortBy === 'price-asc') sortedProducts.sort((a, b) => a.price - b.price);
  else if (sortBy === 'price-desc') sortedProducts.sort((a, b) => b.price - a.price);

  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />

      <main className="pt-20 lg:pt-24">
        <section className="py-16 lg:py-24 text-center">
          <div className="container-fashion">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <span className="text-caption text-muted-foreground mb-4 block">Automne / Hiver 2024</span>
              <h1 className="text-display mb-4">Collection</h1>
              <p className="text-body text-muted-foreground max-w-xl mx-auto">Découvrez notre sélection de pièces élégantes et intemporelles.</p>
            </motion.div>
          </div>
        </section>

        <div className="border-y border-border sticky top-16 lg:top-20 bg-background z-40">
          <div className="container-fashion">
            <div className="flex items-center justify-between h-14">
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="flex items-center gap-2 text-caption">
                <SlidersHorizontal className="w-4 h-4" />Filtrer
                {hasFilters && <span className="w-5 h-5 bg-foreground text-background text-[10px] flex items-center justify-center">{selectedSizes.length + selectedColors.length}</span>}
              </button>
              <span className="text-sm text-muted-foreground hidden sm:block">{sortedProducts.length} produits</span>
              <div className="relative">
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="appearance-none bg-transparent text-caption pr-6 cursor-pointer focus:outline-none">
                  {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
                <ChevronDown className="w-4 h-4 absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {isFilterOpen && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-b border-border bg-secondary overflow-hidden">
            <div className="container-fashion py-8">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-caption mb-4">Taille</h3>
                  <div className="flex flex-wrap gap-2">
                    {sizes.map((size) => <button key={size} onClick={() => toggleSize(size)} className={`filter-chip ${selectedSizes.includes(size) ? 'active' : ''}`}>{size}</button>)}
                  </div>
                </div>
                <div>
                  <h3 className="text-caption mb-4">Couleur</h3>
                  <div className="flex flex-wrap gap-2">
                    {colors.map((color) => <button key={color} onClick={() => toggleColor(color)} className={`filter-chip ${selectedColors.includes(color) ? 'active' : ''}`}>{color}</button>)}
                  </div>
                </div>
              </div>
              {hasFilters && <button onClick={clearFilters} className="mt-6 flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"><X className="w-4 h-4" />Effacer les filtres</button>}
            </div>
          </motion.div>
        )}

        <section className="py-12 lg:py-20">
          <div className="container-fashion"><ProductGrid products={sortedProducts} /></div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

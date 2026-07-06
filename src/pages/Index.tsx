import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { HeroSection } from '@/components/home/HeroSection';
import { CollectionsSection } from '@/components/home/CollectionsSection';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { CategoriesSection } from '@/components/home/CategoriesSection';
import { BrandStory } from '@/components/home/BrandStory';
import { InstagramFeed } from '@/components/home/InstagramFeed';

const Index = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <CartDrawer />
      
      <main>
        <HeroSection />
        <CollectionsSection />
        <FeaturedProducts />
        <CategoriesSection />
        <BrandStory />
        <InstagramFeed />
      </main>

      <Footer />
    </div>
  );
};

export default Index;

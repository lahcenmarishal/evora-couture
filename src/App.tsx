import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Collection from "./pages/Collection";
import ProductDetail from "./pages/ProductDetail";
import Checkout from "./pages/Checkout";
import NotFound from "./pages/NotFound";
import FAQ from "./pages/FAQ";
import Livraison from "./pages/Livraison";
import GuideTailles from "./pages/GuideTailles";
import Contact from "./pages/Contact";
import Confidentialite from "./pages/Confidentialite";
import MentionsLegales from "./pages/MentionsLegales";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminTracking from "./pages/admin/AdminTracking";
import AdminPromos from "./pages/admin/AdminPromos";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminProtectedRoute from "./components/admin/AdminProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/collection" element={<Collection />} />
            <Route path="/collection/:categorySlug" element={<Collection />} />
            <Route path="/categorie/:categorySlug" element={<Collection />} />
            <Route path="/produit/:slug" element={<ProductDetail />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/best-sellers" element={<Collection />} />
            
            {/* Footer Pages */}
            <Route path="/faq" element={<FAQ />} />
            <Route path="/livraison" element={<Livraison />} />
            <Route path="/guide-tailles" element={<GuideTailles />} />
            <Route path="/contact" element={<Contact />} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
            <Route path="/admin/produits" element={<AdminProtectedRoute><AdminProducts /></AdminProtectedRoute>} />
            <Route path="/admin/commandes" element={<AdminProtectedRoute><AdminOrders /></AdminProtectedRoute>} />
            <Route path="/admin/suivi" element={<AdminProtectedRoute><AdminTracking /></AdminProtectedRoute>} />
            <Route path="/admin/promos" element={<AdminProtectedRoute><AdminPromos /></AdminProtectedRoute>} />
            <Route path="/admin/parametres" element={<AdminProtectedRoute><AdminSettings /></AdminProtectedRoute>} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

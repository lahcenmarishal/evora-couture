import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { Loader2 } from 'lucide-react';

interface AdminProtectedRouteProps {
  children: ReactNode;
}

export default function AdminProtectedRoute({ children }: AdminProtectedRouteProps) {
  const { user, isAdmin, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
        <h1 className="font-display text-2xl mb-2">Accès refusé</h1>
        <p className="text-muted-foreground text-center mb-6">
          Vous n'avez pas les permissions nécessaires pour accéder à cette page.
        </p>
        <a href="/" className="text-sm underline hover:no-underline">
          Retour au site
        </a>
      </div>
    );
  }

  return <>{children}</>;
}

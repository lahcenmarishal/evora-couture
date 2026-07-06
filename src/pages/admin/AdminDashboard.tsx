import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp,
  ShoppingBag,
  Package,
  Users,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  totalProducts: number;
  pendingOrders: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total: number;
  status: string;
  created_at: string;
}

const statusLabels: Record<string, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }> = {
  pending: { label: 'En attente', variant: 'outline' },
  confirmed: { label: 'Confirmée', variant: 'secondary' },
  shipped: { label: 'Expédiée', variant: 'default' },
  delivered: { label: 'Livrée', variant: 'default' },
  cancelled: { label: 'Annulée', variant: 'destructive' },
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalRevenue: 0,
    totalOrders: 0,
    totalProducts: 0,
    pendingOrders: 0,
  });
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      // Fetch orders for stats
      const { data: orders } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      // Fetch products count
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      if (orders) {
        const totalRevenue = orders.reduce((sum, order) => sum + Number(order.total), 0);
        const pendingOrders = orders.filter(o => o.status === 'pending').length;
        
        setStats({
          totalRevenue,
          totalOrders: orders.length,
          totalProducts: productsCount || 0,
          pendingOrders,
        });

        setRecentOrders(orders.slice(0, 5));
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('fr-MA', {
      style: 'currency',
      currency: 'MAD',
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date));
  };

  const statCards = [
    {
      title: 'Chiffre d\'affaires',
      value: formatCurrency(stats.totalRevenue),
      icon: TrendingUp,
      trend: '+12%',
      trendUp: true,
    },
    {
      title: 'Commandes totales',
      value: stats.totalOrders,
      icon: ShoppingBag,
      trend: '+8%',
      trendUp: true,
    },
    {
      title: 'Produits',
      value: stats.totalProducts,
      icon: Package,
      trend: null,
      trendUp: null,
    },
    {
      title: 'En attente',
      value: stats.pendingOrders,
      icon: Users,
      trend: stats.pendingOrders > 0 ? 'À traiter' : null,
      trendUp: false,
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-2xl mb-1">Dashboard</h1>
          <p className="text-muted-foreground text-sm">
            Vue d'ensemble de votre boutique
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                    </div>
                    {stat.trend && (
                      <div className={`flex items-center gap-1 text-xs ${
                        stat.trendUp ? 'text-green-600' : 'text-orange-600'
                      }`}>
                        {stat.trendUp ? (
                          <ArrowUpRight className="h-3 w-3" />
                        ) : stat.trendUp === false ? (
                          <ArrowDownRight className="h-3 w-3" />
                        ) : null}
                        {stat.trend}
                      </div>
                    )}
                  </div>
                  <div className="text-2xl font-semibold mb-1">{stat.value}</div>
                  <div className="text-xs text-muted-foreground uppercase tracking-wide">
                    {stat.title}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Recent Orders */}
        <Card className="border-border">
          <CardHeader>
            <CardTitle className="text-lg font-medium">Commandes récentes</CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">
                Chargement...
              </div>
            ) : recentOrders.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                Aucune commande pour le moment
              </div>
            ) : (
              <div className="space-y-4">
                {recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-center justify-between py-3 border-b border-border last:border-0"
                  >
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{order.order_number}</span>
                        <Badge variant={statusLabels[order.status]?.variant || 'outline'}>
                          {statusLabels[order.status]?.label || order.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {order.customer_name} • {formatDate(order.created_at)}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-medium">{formatCurrency(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}

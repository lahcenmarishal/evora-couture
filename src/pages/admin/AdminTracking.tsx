import { useEffect, useState } from 'react';
import { Search, Truck, Package, Copy, Check } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TrackingManager } from '@/components/admin/TrackingManager';
import { ManualTrackingDialog } from '@/components/admin/ManualTrackingDialog';
import { useToast } from '@/hooks/use-toast';

const STATUS_LABELS: Record<string, string> = {
  commande_recue: 'Commande reçue',
  preparation: 'Préparation',
  packaging: 'Packaging',
  pris_en_charge: 'Pris en charge',
  en_transport: 'En transport',
  arrive_agence: "Arrivé à l'agence",
  en_livraison: 'En livraison',
  livre: 'Livré',
  retour_agence: 'Retour en agence',
  refuse: 'Refusé',
  annule: 'Annulé',
};

const STATUS_VARIANT: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  livre: 'default',
  en_livraison: 'default',
  en_transport: 'secondary',
  pris_en_charge: 'secondary',
  refuse: 'destructive',
  annule: 'destructive',
  retour_agence: 'destructive',
};

export default function AdminTracking() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selected, setSelected] = useState<any>(null);
  const [copied, setCopied] = useState<string | null>(null);
  const { toast } = useToast();

  const load = async () => {
    setLoading(true);
    const { data, error } = await (supabase as any)
      .from('orders')
      .select('id, order_number, tracking_number, tracking_status, customer_name, shipping_city, shipping_address, total, deposit_amount, shipped_at, estimated_delivery_at, delivered_at, created_at, status')
      .order('created_at', { ascending: false });
    if (error) {
      toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
    setOrders(data || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const copyTracking = async (num: string) => {
    await navigator.clipboard.writeText(num);
    setCopied(num);
    toast({ title: 'Copié', description: num });
    setTimeout(() => setCopied(null), 1500);
  };

  const filtered = orders.filter(o => {
    const q = search.toLowerCase();
    const matches = !q ||
      o.order_number?.toLowerCase().includes(q) ||
      o.tracking_number?.toLowerCase().includes(q) ||
      o.customer_name?.toLowerCase().includes(q);
    const status = statusFilter === 'all' || o.tracking_status === statusFilter;
    return matches && status;
  });

  const formatDate = (d?: string | null) =>
    d ? new Date(d).toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

  const city = (o: any) => o.shipping_city || (o.shipping_address as any)?.city || '—';

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h1 className="font-display text-2xl mb-1">Suivi des colis</h1>
            <p className="text-muted-foreground text-sm">
              Gérez le suivi et les livraisons de vos commandes
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <Badge variant="outline" className="gap-1"><Package className="w-3 h-3" /> {orders.length} commandes</Badge>
            <Badge variant="default" className="gap-1"><Truck className="w-3 h-3" /> {orders.filter(o => ['en_transport','en_livraison','pris_en_charge'].includes(o.tracking_status)).length} en cours</Badge>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="N° commande, N° suivi, client..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-[200px]"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Tous les statuts</SelectItem>
              {Object.entries(STATUS_LABELS).map(([v, l]) => (
                <SelectItem key={v} value={v}>{l}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <p className="text-center py-12 text-muted-foreground">Chargement...</p>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground border rounded-md">
            <Truck className="w-10 h-10 mx-auto mb-2 opacity-50" />
            <p>Aucune commande à suivre</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {filtered.map((o) => {
              const status = o.tracking_status || 'commande_recue';
              return (
                <button
                  key={o.id}
                  onClick={() => setSelected(o)}
                  className="text-left bg-background border border-border rounded-md p-4 hover:border-foreground/40 transition-colors"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium">{o.order_number}</span>
                        <Badge variant={STATUS_VARIANT[status] || 'outline'}>
                          {STATUS_LABELS[status] || status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {o.customer_name} · {city(o)}
                      </p>
                    </div>
                    <div className="text-right">
                      {o.tracking_number ? (
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={(e) => { e.stopPropagation(); copyTracking(o.tracking_number); }}
                          className="inline-flex items-center gap-1 text-xs font-mono bg-secondary px-2 py-1 rounded hover:bg-secondary/70 cursor-pointer"
                        >
                          {copied === o.tracking_number ? <Check className="w-3 h-3" /> : <Copy className="w-3 h-3" />}
                          {o.tracking_number}
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">Pas de N° suivi</span>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        Expédié: {formatDate(o.shipped_at)}
                      </p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Dialog open={!!selected} onOpenChange={(o) => !o && setSelected(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Suivi — {selected?.order_number}</DialogTitle>
          </DialogHeader>
          {selected && (
            <div className="pt-2">
              <TrackingManager orderId={selected.id} />
            </div>
          )}
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

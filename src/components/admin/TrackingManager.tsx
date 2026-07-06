import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Trash2 } from 'lucide-react';

const STATUSES = [
  ['commande_recue', 'Commande reçue'],
  ['preparation', 'Préparation'],
  ['packaging', 'Packaging'],
  ['pris_en_charge', 'Pris en charge'],
  ['en_transport', 'En transport'],
  ['arrive_agence', 'Arrivé à l\'agence'],
  ['en_livraison', 'En livraison'],
  ['livre', 'Livré'],
  ['retour_agence', 'Retour en agence'],
  ['refuse', 'Refusé'],
  ['annule', 'Annulé'],
] as const;

const toInput = (d: string | null) => (d ? new Date(d).toISOString().slice(0, 16) : '');
const fromInput = (v: string) => (v ? new Date(v).toISOString() : null);

export function TrackingManager({ orderId }: { orderId: string }) {
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [order, setOrder] = useState<any>(null);
  const [events, setEvents] = useState<any[]>([]);
  const [newStatus, setNewStatus] = useState<string>('preparation');
  const [newComment, setNewComment] = useState('');

  const load = async () => {
    setLoading(true);
    const { data: o } = await (supabase as any)
      .from('orders').select('*').eq('id', orderId).single();
    const { data: ev } = await (supabase as any)
      .from('order_tracking_events').select('*')
      .eq('order_id', orderId).order('occurred_at', { ascending: false });
    setOrder(o); setEvents(ev || []); setLoading(false);
  };

  useEffect(() => { load(); }, [orderId]);

  const save = async (patch: any) => {
    const { error } = await (supabase as any).from('orders').update(patch).eq('id', orderId);
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    toast({ title: 'Mis à jour' });
    load();
  };

  const addEvent = async () => {
    if (!newStatus) return;
    const { error } = await (supabase as any).from('order_tracking_events').insert({
      order_id: orderId, status: newStatus, comment: newComment || null,
    });
    if (error) return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    // Also update the order tracking_status
    const patch: any = { tracking_status: newStatus };
    if (newStatus === 'livre') patch.delivered_at = new Date().toISOString();
    if (newStatus === 'pris_en_charge' && !order?.shipped_at) patch.shipped_at = new Date().toISOString();
    await (supabase as any).from('orders').update(patch).eq('id', orderId);
    setNewComment('');
    toast({ title: 'Événement ajouté' });
    load();
  };

  const deleteEvent = async (id: string) => {
    await (supabase as any).from('order_tracking_events').delete().eq('id', id);
    load();
  };

  if (loading || !order) return <p className="text-sm text-muted-foreground">Chargement du suivi...</p>;

  const remaining = Number(order.total || 0) - Number(order.deposit_amount || 0);

  return (
    <div className="space-y-5 border-t pt-5">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Suivi du colis</h3>
        <Badge variant="outline" className="font-mono">{order.tracking_number || '—'}</Badge>
      </div>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <Label className="text-xs">Statut de suivi</Label>
          <Select value={order.tracking_status} onValueChange={(v) => save({ tracking_status: v })}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-xs">Ville de livraison</Label>
          <Input
            defaultValue={order.shipping_city || ''}
            onBlur={(e) => e.target.value !== (order.shipping_city || '') && save({ shipping_city: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-xs">Date d'expédition</Label>
          <Input type="datetime-local" defaultValue={toInput(order.shipped_at)}
            onBlur={(e) => save({ shipped_at: fromInput(e.target.value) })} />
        </div>
        <div>
          <Label className="text-xs">Livraison estimée</Label>
          <Input type="datetime-local" defaultValue={toInput(order.estimated_delivery_at)}
            onBlur={(e) => save({ estimated_delivery_at: fromInput(e.target.value) })} />
        </div>
        <div>
          <Label className="text-xs">Date de livraison réelle</Label>
          <Input type="datetime-local" defaultValue={toInput(order.delivered_at)}
            onBlur={(e) => save({ delivered_at: fromInput(e.target.value) })} />
        </div>
        <div>
          <Label className="text-xs">Acompte payé (DH)</Label>
          <Input type="number" step="0.01" defaultValue={order.deposit_amount || 0}
            onBlur={(e) => save({ deposit_amount: Number(e.target.value) || 0 })} />
        </div>
      </div>

      <div className="bg-secondary p-3 rounded text-sm flex justify-between">
        <span>Reste à payer à la livraison</span>
        <span className="font-medium">{new Intl.NumberFormat('fr-MA').format(remaining)} DH</span>
      </div>

      <div className="space-y-2 border-t pt-4">
        <Label className="text-xs">Ajouter un événement</Label>
        <div className="grid grid-cols-[1fr_2fr_auto] gap-2">
          <Select value={newStatus} onValueChange={setNewStatus}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              {STATUSES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
            </SelectContent>
          </Select>
          <Input placeholder="Commentaire (optionnel)" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
          <Button onClick={addEvent}>Ajouter</Button>
        </div>
      </div>

      {events.length > 0 && (
        <div className="space-y-1 text-xs max-h-48 overflow-y-auto border rounded p-2">
          {events.map((e) => (
            <div key={e.id} className="flex items-center justify-between gap-2 py-1 border-b last:border-0">
              <span className="text-muted-foreground w-28 shrink-0">{new Date(e.occurred_at).toLocaleString('fr-FR')}</span>
              <span className="font-medium flex-1">{STATUSES.find(([v]) => v === e.status)?.[1]}</span>
              {e.comment && <span className="text-muted-foreground flex-1 truncate">{e.comment}</span>}
              <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => deleteEvent(e.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

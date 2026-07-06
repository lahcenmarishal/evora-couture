import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Plus } from 'lucide-react';

const STATUSES = [
  ['commande_recue', 'Commande reçue'],
  ['preparation', 'Préparation'],
  ['packaging', 'Packaging'],
  ['pris_en_charge', 'Pris en charge'],
  ['en_transport', 'En transport'],
  ['arrive_agence', "Arrivé à l'agence"],
  ['en_livraison', 'En livraison'],
  ['livre', 'Livré'],
] as const;

interface Props {
  onCreated?: () => void;
}

export function ManualTrackingDialog({ onCreated }: Props) {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    customer_name: '',
    customer_email: '',
    customer_phone: '',
    address: '',
    city: '',
    total: '',
    deposit_amount: '0',
    payment_method: 'cod',
    tracking_status: 'preparation',
    notes: '',
  });

  const update = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = async () => {
    if (!form.customer_name.trim() || !form.city.trim() || !form.total) {
      return toast({
        title: 'Champs requis',
        description: 'Nom du client, ville et total sont obligatoires',
        variant: 'destructive',
      });
    }
    setSaving(true);
    const { error } = await (supabase as any).from('orders').insert({
      customer_name: form.customer_name.trim(),
      customer_email: form.customer_email.trim() || 'manual@evoracouture.com',
      customer_phone: form.customer_phone.trim() || null,
      shipping_address: {
        address: form.address.trim(),
        city: form.city.trim(),
      },
      shipping_city: form.city.trim(),
      items: [],
      subtotal: Number(form.total),
      shipping_cost: 0,
      discount: 0,
      total: Number(form.total),
      deposit_amount: Number(form.deposit_amount) || 0,
      payment_method: form.payment_method,
      tracking_status: form.tracking_status,
      status: 'confirmed',
      notes: form.notes.trim() || null,
    });
    setSaving(false);
    if (error) {
      return toast({ title: 'Erreur', description: error.message, variant: 'destructive' });
    }
    toast({ title: 'Colis créé', description: 'Numéro de suivi généré automatiquement' });
    setOpen(false);
    setForm({
      customer_name: '', customer_email: '', customer_phone: '',
      address: '', city: '', total: '', deposit_amount: '0',
      payment_method: 'cod', tracking_status: 'preparation', notes: '',
    });
    onCreated?.();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button onClick={() => setOpen(true)} className="gap-2">
        <Plus className="w-4 h-4" /> Nouveau colis
      </Button>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Créer un colis manuellement</DialogTitle>
        </DialogHeader>
        <div className="grid gap-3 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Nom du client *</Label>
              <Input value={form.customer_name} onChange={(e) => update('customer_name', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Téléphone</Label>
              <Input value={form.customer_phone} onChange={(e) => update('customer_phone', e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Email</Label>
            <Input type="email" value={form.customer_email} onChange={(e) => update('customer_email', e.target.value)} />
          </div>
          <div>
            <Label className="text-xs">Adresse</Label>
            <Input value={form.address} onChange={(e) => update('address', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Ville *</Label>
              <Input value={form.city} onChange={(e) => update('city', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Paiement</Label>
              <Select value={form.payment_method} onValueChange={(v) => update('payment_method', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="cod">Paiement à la livraison</SelectItem>
                  <SelectItem value="bank_transfer">Virement</SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Total (DH) *</Label>
              <Input type="number" step="0.01" value={form.total} onChange={(e) => update('total', e.target.value)} />
            </div>
            <div>
              <Label className="text-xs">Acompte (DH)</Label>
              <Input type="number" step="0.01" value={form.deposit_amount} onChange={(e) => update('deposit_amount', e.target.value)} />
            </div>
          </div>
          <div>
            <Label className="text-xs">Statut initial</Label>
            <Select value={form.tracking_status} onValueChange={(v) => update('tracking_status', v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {STATUSES.map(([v, l]) => <SelectItem key={v} value={v}>{l}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs">Notes</Label>
            <Textarea rows={2} value={form.notes} onChange={(e) => update('notes', e.target.value)} />
          </div>
          <p className="text-xs text-muted-foreground bg-secondary p-2 rounded">
            Le numéro de suivi et le numéro de commande seront générés automatiquement.
          </p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>Annuler</Button>
          <Button onClick={submit} disabled={saving}>
            {saving ? 'Création...' : 'Créer le colis'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

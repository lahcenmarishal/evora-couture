import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Plus,
  Search,
  MoreHorizontal,
  Edit,
  Trash2,
  Tag,
  Percent,
  DollarSign,
} from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert, TablesUpdate } from '@/integrations/supabase/types';

type PromoCode = Tables<'promo_codes'>;
type PromoCodeInsert = TablesInsert<'promo_codes'>;
type PromoCodeUpdate = TablesUpdate<'promo_codes'>;

export default function AdminPromos() {
  const [promoCodes, setPromoCodes] = useState<PromoCode[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [selectedPromo, setSelectedPromo] = useState<PromoCode | null>(null);
  const [formData, setFormData] = useState<Partial<PromoCodeInsert>>({
    code: '',
    description: '',
    discount_type: 'percentage',
    discount_value: 0,
    min_order_amount: null,
    max_uses: null,
    is_active: true,
    valid_until: null,
  });
  const { toast } = useToast();

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    try {
      const { data, error } = await supabase
        .from('promo_codes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPromoCodes(data || []);
    } catch (error) {
      console.error('Error fetching promo codes:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les codes promo',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenCreate = () => {
    setSelectedPromo(null);
    setFormData({
      code: '',
      description: '',
      discount_type: 'percentage',
      discount_value: 0,
      min_order_amount: null,
      max_uses: null,
      is_active: true,
      valid_until: null,
    });
    setDialogOpen(true);
  };

  const handleOpenEdit = (promo: PromoCode) => {
    setSelectedPromo(promo);
    setFormData({
      code: promo.code,
      description: promo.description || '',
      discount_type: promo.discount_type,
      discount_value: promo.discount_value,
      min_order_amount: promo.min_order_amount,
      max_uses: promo.max_uses,
      is_active: promo.is_active,
      valid_until: promo.valid_until?.split('T')[0] || null,
    });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.code || !formData.discount_value) {
      toast({
        title: 'Erreur',
        description: 'Veuillez remplir les champs obligatoires',
        variant: 'destructive',
      });
      return;
    }

    const promoData = {
      ...formData,
      code: formData.code?.toUpperCase(),
      discount_value: Number(formData.discount_value),
      min_order_amount: formData.min_order_amount ? Number(formData.min_order_amount) : null,
      max_uses: formData.max_uses ? Number(formData.max_uses) : null,
      valid_until: formData.valid_until ? new Date(formData.valid_until).toISOString() : null,
    };

    try {
      if (selectedPromo) {
        const { error } = await supabase
          .from('promo_codes')
          .update(promoData as PromoCodeUpdate)
          .eq('id', selectedPromo.id);

        if (error) throw error;
        toast({ title: 'Code promo mis à jour' });
      } else {
        const { error } = await supabase
          .from('promo_codes')
          .insert(promoData as PromoCodeInsert);

        if (error) throw error;
        toast({ title: 'Code promo créé' });
      }

      setDialogOpen(false);
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error saving promo code:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de sauvegarder le code promo',
        variant: 'destructive',
      });
    }
  };

  const handleDelete = async () => {
    if (!selectedPromo) return;

    try {
      const { error } = await supabase
        .from('promo_codes')
        .delete()
        .eq('id', selectedPromo.id);

      if (error) throw error;
      
      toast({ title: 'Code promo supprimé' });
      setDeleteDialogOpen(false);
      setSelectedPromo(null);
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error deleting promo code:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer le code promo',
        variant: 'destructive',
      });
    }
  };

  const togglePromoStatus = async (promo: PromoCode) => {
    try {
      const { error } = await supabase
        .from('promo_codes')
        .update({ is_active: !promo.is_active })
        .eq('id', promo.id);

      if (error) throw error;
      toast({ title: promo.is_active ? 'Code désactivé' : 'Code activé' });
      fetchPromoCodes();
    } catch (error: any) {
      console.error('Error toggling promo status:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de modifier le statut',
        variant: 'destructive',
      });
    }
  };

  const filteredPromoCodes = promoCodes.filter(promo =>
    promo.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    promo.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      year: 'numeric',
    }).format(new Date(date));
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-2xl mb-1">Codes Promo</h1>
            <p className="text-muted-foreground text-sm">
              Gérez vos codes de réduction
            </p>
          </div>
          <Button onClick={handleOpenCreate} className="gap-2">
            <Plus className="h-4 w-4" />
            Nouveau code
          </Button>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un code..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Promo Codes Table */}
        <div className="border border-border rounded-md bg-background">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Code</TableHead>
                <TableHead>Réduction</TableHead>
                <TableHead>Utilisations</TableHead>
                <TableHead>Validité</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isLoading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    Chargement...
                  </TableCell>
                </TableRow>
              ) : filteredPromoCodes.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground">
                      <Tag className="h-8 w-8" />
                      <span>Aucun code promo trouvé</span>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredPromoCodes.map((promo) => (
                  <TableRow key={promo.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-md bg-secondary flex items-center justify-center">
                          {promo.discount_type === 'percentage' ? (
                            <Percent className="h-4 w-4 text-muted-foreground" />
                          ) : (
                            <DollarSign className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                        <div>
                          <p className="font-mono font-medium">{promo.code}</p>
                          {promo.description && (
                            <p className="text-sm text-muted-foreground">{promo.description}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium">
                        {promo.discount_type === 'percentage'
                          ? `${promo.discount_value}%`
                          : formatCurrency(promo.discount_value)}
                      </span>
                      {promo.min_order_amount && (
                        <p className="text-xs text-muted-foreground">
                          Min. {formatCurrency(promo.min_order_amount)}
                        </p>
                      )}
                    </TableCell>
                    <TableCell>
                      <span>{promo.uses_count}</span>
                      {promo.max_uses && (
                        <span className="text-muted-foreground"> / {promo.max_uses}</span>
                      )}
                    </TableCell>
                    <TableCell>
                      {promo.valid_until ? (
                        <span className="text-sm">
                          Jusqu'au {formatDate(promo.valid_until)}
                        </span>
                      ) : (
                        <span className="text-sm text-muted-foreground">Illimité</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <Switch
                        checked={promo.is_active}
                        onCheckedChange={() => togglePromoStatus(promo)}
                      />
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem onClick={() => handleOpenEdit(promo)}>
                            <Edit className="h-4 w-4 mr-2" />
                            Modifier
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => {
                              setSelectedPromo(promo);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Supprimer
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Create/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedPromo ? 'Modifier le code promo' : 'Nouveau code promo'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                placeholder="SUMMER20"
                className="font-mono"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Réduction été 2024..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="discount_type">Type de réduction</Label>
                <Select
                  value={formData.discount_type}
                  onValueChange={(value) => setFormData({ ...formData, discount_type: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Pourcentage (%)</SelectItem>
                    <SelectItem value="fixed">Montant fixe (MAD)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="discount_value">Valeur *</Label>
                <Input
                  id="discount_value"
                  type="number"
                  value={formData.discount_value}
                  onChange={(e) => setFormData({ ...formData, discount_value: parseFloat(e.target.value) || 0 })}
                  placeholder={formData.discount_type === 'percentage' ? '20' : '50'}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="min_order_amount">Montant minimum (MAD)</Label>
                <Input
                  id="min_order_amount"
                  type="number"
                  value={formData.min_order_amount || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    min_order_amount: e.target.value ? parseFloat(e.target.value) : null 
                  })}
                  placeholder="100"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="max_uses">Utilisations max</Label>
                <Input
                  id="max_uses"
                  type="number"
                  value={formData.max_uses || ''}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    max_uses: e.target.value ? parseInt(e.target.value) : null 
                  })}
                  placeholder="100"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="valid_until">Valide jusqu'au</Label>
              <Input
                id="valid_until"
                type="date"
                value={formData.valid_until || ''}
                onChange={(e) => setFormData({ ...formData, valid_until: e.target.value || null })}
              />
            </div>

            <div className="flex items-center justify-between py-2">
              <div>
                <Label htmlFor="is_active" className="text-sm font-medium">Actif</Label>
                <p className="text-xs text-muted-foreground">Le code peut être utilisé</p>
              </div>
              <Switch
                id="is_active"
                checked={formData.is_active}
                onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleSubmit}>
              {selectedPromo ? 'Mettre à jour' : 'Créer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le code promo</DialogTitle>
          </DialogHeader>
          <p className="text-muted-foreground">
            Êtes-vous sûr de vouloir supprimer le code "{selectedPromo?.code}" ? 
            Cette action est irréversible.
          </p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Annuler
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Supprimer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}

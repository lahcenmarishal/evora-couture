import { useState, useEffect } from 'react';
import { Plus, Trash2, Package } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import type { Tables, TablesInsert } from '@/integrations/supabase/types';

type ProductVariant = Tables<'product_variants'>;
type VariantInsert = TablesInsert<'product_variants'>;

interface ProductVariantsManagerProps {
  productId: string;
  productName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function ProductVariantsManager({
  productId,
  productName,
  open,
  onOpenChange,
}: ProductVariantsManagerProps) {
  const [variants, setVariants] = useState<ProductVariant[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [formData, setFormData] = useState<Partial<VariantInsert>>({
    size: '',
    color: '',
    stock: 0,
    sku: '',
  });
  const { toast } = useToast();

  useEffect(() => {
    if (open && productId) {
      fetchVariants();
    }
  }, [open, productId]);

  const fetchVariants = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('product_variants')
        .select('*')
        .eq('product_id', productId)
        .order('color', { ascending: true })
        .order('size', { ascending: true });

      if (error) throw error;
      setVariants(data || []);
    } catch (error) {
      console.error('Error fetching variants:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger les variantes',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariant = async () => {
    if (!formData.size || !formData.color) {
      toast({
        title: 'Erreur',
        description: 'La taille et la couleur sont obligatoires',
        variant: 'destructive',
      });
      return;
    }

    try {
      const { error } = await supabase.from('product_variants').insert({
        product_id: productId,
        size: formData.size.trim(),
        color: formData.color.trim(),
        stock: Number(formData.stock) || 0,
        sku: formData.sku?.trim() || null,
      });

      if (error) throw error;

      toast({ title: 'Variante ajoutée' });
      setAddDialogOpen(false);
      setFormData({ size: '', color: '', stock: 0, sku: '' });
      fetchVariants();
    } catch (error: any) {
      console.error('Error adding variant:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible d\'ajouter la variante',
        variant: 'destructive',
      });
    }
  };

  const handleUpdateStock = async (variantId: string, newStock: number) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .update({ stock: newStock })
        .eq('id', variantId);

      if (error) throw error;

      setVariants(variants.map(v => 
        v.id === variantId ? { ...v, stock: newStock } : v
      ));
    } catch (error) {
      console.error('Error updating stock:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le stock',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteVariant = async (variantId: string) => {
    try {
      const { error } = await supabase
        .from('product_variants')
        .delete()
        .eq('id', variantId);

      if (error) throw error;

      toast({ title: 'Variante supprimée' });
      fetchVariants();
    } catch (error: any) {
      console.error('Error deleting variant:', error);
      toast({
        title: 'Erreur',
        description: error.message || 'Impossible de supprimer la variante',
        variant: 'destructive',
      });
    }
  };

  const getTotalStock = () => {
    return variants.reduce((sum, v) => sum + v.stock, 0);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Variantes - {productName}
            </DialogTitle>
          </DialogHeader>

          <div className="py-4">
            <div className="flex items-center justify-between mb-4">
              <div className="text-sm text-muted-foreground">
                Stock total : <span className="font-medium text-foreground">{getTotalStock()} unités</span>
              </div>
              <Button size="sm" onClick={() => setAddDialogOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Ajouter une variante
              </Button>
            </div>

            <div className="border border-border rounded-md">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Couleur</TableHead>
                    <TableHead>Taille</TableHead>
                    <TableHead>SKU</TableHead>
                    <TableHead className="w-24">Stock</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        Chargement...
                      </TableCell>
                    </TableRow>
                  ) : variants.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={5} className="text-center py-8">
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <Package className="h-8 w-8" />
                          <span>Aucune variante</span>
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => setAddDialogOpen(true)}
                            className="mt-2"
                          >
                            Ajouter une variante
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    variants.map((variant) => (
                      <TableRow key={variant.id}>
                        <TableCell>
                          <span className="font-medium">{variant.color}</span>
                        </TableCell>
                        <TableCell>{variant.size}</TableCell>
                        <TableCell>
                          <span className="text-muted-foreground text-sm">
                            {variant.sku || '-'}
                          </span>
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min="0"
                            value={variant.stock}
                            onChange={(e) => handleUpdateStock(variant.id, parseInt(e.target.value) || 0)}
                            className="w-20 h-8"
                          />
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeleteVariant(variant.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Fermer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Variant Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Ajouter une variante</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="color">Couleur *</Label>
                <Input
                  id="color"
                  value={formData.color}
                  onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                  placeholder="Noir"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="size">Taille *</Label>
                <Input
                  id="size"
                  value={formData.size}
                  onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                  placeholder="M"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })}
                  placeholder="10"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input
                  id="sku"
                  value={formData.sku || ''}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="PROD-001-BLK-M"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handleAddVariant}>
              Ajouter
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

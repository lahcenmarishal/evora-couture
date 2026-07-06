import { useState } from 'react';
import { motion } from 'framer-motion';
import { Save, Store, Truck, CreditCard, FileText } from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';

export default function AdminSettings() {
  const { toast } = useToast();
  
  const [storeSettings, setStoreSettings] = useState({
    storeName: 'EVORA COUTURE',
    storeEmail: 'contact@razza.ma',
    storePhone: '+212 5XX XX XX XX',
    storeAddress: 'Casablanca, Maroc',
  });

  const [shippingSettings, setShippingSettings] = useState({
    freeShipping: true,
    freeShippingThreshold: 500,
    flatRate: 30,
  });

  const [seoSettings, setSeoSettings] = useState({
    metaTitle: 'EVORA COUTURE - Mode Femme Élégante',
    metaDescription: 'Découvrez la nouvelle collection EVORA COUTURE. Mode femme élégante et contemporaine. Livraison partout au Maroc.',
  });

  const handleSave = (section: string) => {
    toast({
      title: 'Paramètres sauvegardés',
      description: `Les paramètres ${section} ont été mis à jour.`,
    });
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-2xl mb-1">Paramètres</h1>
          <p className="text-muted-foreground text-sm">
            Configurez votre boutique
          </p>
        </div>

        <Tabs defaultValue="store" className="space-y-6">
          <TabsList className="grid grid-cols-4 w-full max-w-xl">
            <TabsTrigger value="store" className="gap-2">
              <Store className="h-4 w-4" />
              <span className="hidden sm:inline">Boutique</span>
            </TabsTrigger>
            <TabsTrigger value="shipping" className="gap-2">
              <Truck className="h-4 w-4" />
              <span className="hidden sm:inline">Livraison</span>
            </TabsTrigger>
            <TabsTrigger value="payment" className="gap-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Paiement</span>
            </TabsTrigger>
            <TabsTrigger value="seo" className="gap-2">
              <FileText className="h-4 w-4" />
              <span className="hidden sm:inline">SEO</span>
            </TabsTrigger>
          </TabsList>

          {/* Store Settings */}
          <TabsContent value="store">
            <Card>
              <CardHeader>
                <CardTitle>Informations boutique</CardTitle>
                <CardDescription>
                  Informations générales de votre boutique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="storeName">Nom de la boutique</Label>
                    <Input
                      id="storeName"
                      value={storeSettings.storeName}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeEmail">Email</Label>
                    <Input
                      id="storeEmail"
                      type="email"
                      value={storeSettings.storeEmail}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeEmail: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storePhone">Téléphone</Label>
                    <Input
                      id="storePhone"
                      value={storeSettings.storePhone}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storePhone: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="storeAddress">Adresse</Label>
                    <Input
                      id="storeAddress"
                      value={storeSettings.storeAddress}
                      onChange={(e) => setStoreSettings({ ...storeSettings, storeAddress: e.target.value })}
                    />
                  </div>
                </div>
                <Button onClick={() => handleSave('boutique')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Shipping Settings */}
          <TabsContent value="shipping">
            <Card>
              <CardHeader>
                <CardTitle>Options de livraison</CardTitle>
                <CardDescription>
                  Configurez vos frais de livraison
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div>
                    <p className="font-medium">Livraison gratuite</p>
                    <p className="text-sm text-muted-foreground">
                      Activer la livraison gratuite au-dessus d'un certain montant
                    </p>
                  </div>
                  <Switch
                    checked={shippingSettings.freeShipping}
                    onCheckedChange={(checked) => setShippingSettings({ ...shippingSettings, freeShipping: checked })}
                  />
                </div>

                {shippingSettings.freeShipping && (
                  <div className="space-y-2">
                    <Label htmlFor="freeShippingThreshold">Seuil livraison gratuite (MAD)</Label>
                    <Input
                      id="freeShippingThreshold"
                      type="number"
                      value={shippingSettings.freeShippingThreshold}
                      onChange={(e) => setShippingSettings({ 
                        ...shippingSettings, 
                        freeShippingThreshold: parseFloat(e.target.value) || 0 
                      })}
                      className="max-w-xs"
                    />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="flatRate">Tarif forfaitaire (MAD)</Label>
                  <Input
                    id="flatRate"
                    type="number"
                    value={shippingSettings.flatRate}
                    onChange={(e) => setShippingSettings({ 
                      ...shippingSettings, 
                      flatRate: parseFloat(e.target.value) || 0 
                    })}
                    className="max-w-xs"
                  />
                  <p className="text-xs text-muted-foreground">
                    Frais appliqués si la commande n'atteint pas le seuil de livraison gratuite
                  </p>
                </div>

                <Button onClick={() => handleSave('livraison')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Payment Settings */}
          <TabsContent value="payment">
            <Card>
              <CardHeader>
                <CardTitle>Moyens de paiement</CardTitle>
                <CardDescription>
                  Configurez les options de paiement acceptées
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div>
                    <p className="font-medium">Paiement à la livraison</p>
                    <p className="text-sm text-muted-foreground">
                      Accepter le paiement en espèces à la livraison
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div>
                    <p className="font-medium">Carte bancaire</p>
                    <p className="text-sm text-muted-foreground">
                      Paiement par carte via Stripe
                    </p>
                  </div>
                  <Switch />
                </div>

                <div className="flex items-center justify-between py-4 border-b border-border">
                  <div>
                    <p className="font-medium">Virement bancaire</p>
                    <p className="text-sm text-muted-foreground">
                      Accepter les virements bancaires
                    </p>
                  </div>
                  <Switch />
                </div>

                <Button onClick={() => handleSave('paiement')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* SEO Settings */}
          <TabsContent value="seo">
            <Card>
              <CardHeader>
                <CardTitle>Référencement (SEO)</CardTitle>
                <CardDescription>
                  Optimisez votre visibilité sur les moteurs de recherche
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="metaTitle">Titre du site</Label>
                  <Input
                    id="metaTitle"
                    value={seoSettings.metaTitle}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaTitle: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    {seoSettings.metaTitle.length}/60 caractères
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="metaDescription">Meta description</Label>
                  <Textarea
                    id="metaDescription"
                    value={seoSettings.metaDescription}
                    onChange={(e) => setSeoSettings({ ...seoSettings, metaDescription: e.target.value })}
                    rows={3}
                  />
                  <p className="text-xs text-muted-foreground">
                    {seoSettings.metaDescription.length}/160 caractères
                  </p>
                </div>

                <Button onClick={() => handleSave('SEO')} className="gap-2">
                  <Save className="h-4 w-4" />
                  Sauvegarder
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Truck, Package, RefreshCw, MapPin } from 'lucide-react';

const deliveryZones = [
  { zone: 'Casablanca, Rabat', delay: '2-3 jours', price: '30 DH' },
  { zone: 'Marrakech, Fès, Tanger', delay: '3-4 jours', price: '40 DH' },
  { zone: 'Autres villes du Maroc', delay: '4-5 jours', price: '50 DH' },
  { zone: 'Europe', delay: '7-10 jours', price: 'À partir de 150 DH' },
  { zone: 'Reste du monde', delay: '10-15 jours', price: 'Sur devis' },
];

export default function Livraison() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container-fashion">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-display-md mb-6">Livraison & Retours</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Découvrez nos conditions de livraison et notre politique de retour 
              pour une expérience d'achat sereine.
            </p>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-20">
            {[
              { icon: Truck, title: 'Livraison Rapide', desc: '2-5 jours au Maroc' },
              { icon: Package, title: 'Emballage Soigné', desc: 'Protection optimale' },
              { icon: RefreshCw, title: 'Retours Gratuits', desc: '14 jours pour changer d\'avis' },
              { icon: MapPin, title: 'Suivi en Temps Réel', desc: 'Où que vous soyez' },
            ].map((feature, index) => (
              <div key={index} className="text-center p-8 border border-border">
                <feature.icon className="w-8 h-8 mx-auto mb-4 text-primary" />
                <h3 className="text-body-lg font-medium mb-2">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">{feature.desc}</p>
              </div>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {/* Delivery Section */}
            <section>
              <h2 className="text-heading-md mb-8 pb-4 border-b border-border">
                Informations de Livraison
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-body-lg font-medium mb-4">Zones de livraison & Délais</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border border-border">
                      <thead className="bg-secondary">
                        <tr>
                          <th className="text-left p-4 text-caption">Zone</th>
                          <th className="text-left p-4 text-caption">Délai estimé</th>
                          <th className="text-left p-4 text-caption">Frais de port</th>
                        </tr>
                      </thead>
                      <tbody>
                        {deliveryZones.map((zone, index) => (
                          <tr key={index} className="border-t border-border">
                            <td className="p-4">{zone.zone}</td>
                            <td className="p-4 text-muted-foreground">{zone.delay}</td>
                            <td className="p-4 font-medium">{zone.price}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <p className="mt-4 text-sm text-muted-foreground">
                    * Livraison gratuite pour toute commande supérieure à 1500 DH au Maroc.
                  </p>
                </div>

                <div>
                  <h3 className="text-body-lg font-medium mb-4">Processus de livraison</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">1.</span>
                      Votre commande est préparée avec soin dans les 24-48h suivant la validation.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">2.</span>
                      Vous recevez un email avec le numéro de suivi dès l'expédition.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">3.</span>
                      Notre partenaire vous contacte pour organiser la livraison.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">4.</span>
                      Paiement à la livraison (espèces) ou carte selon votre choix.
                    </li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Returns Section */}
            <section>
              <h2 className="text-heading-md mb-8 pb-4 border-b border-border">
                Politique de Retours
              </h2>
              
              <div className="space-y-8">
                <div>
                  <h3 className="text-body-lg font-medium mb-4">Conditions de retour</h3>
                  <ul className="space-y-3 text-muted-foreground">
                    <li>• Vous disposez de <strong className="text-foreground">14 jours</strong> après réception pour retourner un article</li>
                    <li>• L'article doit être <strong className="text-foreground">non porté, non lavé</strong>, avec ses étiquettes d'origine</li>
                    <li>• L'emballage d'origine doit être conservé si possible</li>
                    <li>• Les articles sur-mesure et personnalisés ne sont pas éligibles au retour</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-body-lg font-medium mb-4">Comment retourner un article ?</h3>
                  <ol className="space-y-3 text-muted-foreground">
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">1.</span>
                      Contactez-nous par WhatsApp ou email avec votre numéro de commande.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">2.</span>
                      Nous vous communiquons les instructions de retour.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">3.</span>
                      Emballez soigneusement l'article et envoyez-le à l'adresse indiquée.
                    </li>
                    <li className="flex gap-3">
                      <span className="text-primary font-medium">4.</span>
                      Le remboursement est effectué sous 5-7 jours après réception et vérification.
                    </li>
                  </ol>
                </div>

                <div>
                  <h3 className="text-body-lg font-medium mb-4">Échanges</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Vous souhaitez une autre taille ou couleur ? Contactez-nous et nous organiserons 
                    l'échange. Les frais d'envoi du nouvel article sont offerts si l'échange est 
                    demandé dans les 7 jours suivant la réception.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact CTA */}
            <div className="text-center p-12 bg-secondary">
              <h3 className="text-heading-sm mb-4">Une question sur votre commande ?</h3>
              <p className="text-muted-foreground mb-8">
                Notre service client est à votre disposition pour vous accompagner.
              </p>
              <a
                href="/contact"
                className="inline-block px-10 py-4 bg-primary text-primary-foreground text-caption hover:bg-primary/90 transition-colors"
              >
                Nous contacter
              </a>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

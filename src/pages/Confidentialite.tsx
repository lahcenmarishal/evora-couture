import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function Confidentialite() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 lg:pt-32 pb-20">
        <div className="container-fashion max-w-3xl">
          <h1 className="text-title mb-4">Politique de confidentialité</h1>
          <p className="text-sm text-muted-foreground mb-12">Dernière mise à jour : 18 juillet 2026</p>

          <div className="space-y-10 text-body leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-caption text-foreground mb-4">1. Responsable du traitement</h2>
              <p>
                La société <strong className="text-foreground">EVORA COUTURE SARL</strong>, dont le siège
                social est situé au Maroc, est responsable du traitement des données personnelles collectées
                sur le site <a href="https://evoracouture.com" className="underline">evoracouture.com</a>.
              </p>
              <ul className="mt-4 space-y-1">
                <li>• Raison sociale : EVORA COUTURE SARL</li>
                <li>• Email : contact@evoracouture.com</li>
                <li>• Téléphone / WhatsApp : +212 600 000 000</li>
              </ul>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">2. Données collectées</h2>
              <p>Nous collectons uniquement les données nécessaires au traitement de vos commandes :</p>
              <ul className="mt-4 space-y-1">
                <li>• Nom et prénom</li>
                <li>• Adresse de livraison</li>
                <li>• Numéro de téléphone</li>
                <li>• Adresse email</li>
                <li>• Détails de commande</li>
              </ul>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">3. Finalité du traitement</h2>
              <p>Vos données sont utilisées pour :</p>
              <ul className="mt-4 space-y-1">
                <li>• Traiter et livrer vos commandes</li>
                <li>• Vous informer du suivi de votre colis</li>
                <li>• Répondre à vos demandes via le service client</li>
                <li>• Vous envoyer notre newsletter (avec votre consentement)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">4. Conservation des données</h2>
              <p>
                Vos données sont conservées pendant la durée nécessaire au traitement de vos commandes et
                pour respecter nos obligations légales comptables (10 ans maximum).
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">5. Partage des données</h2>
              <p>
                Vos données ne sont jamais vendues. Elles sont partagées uniquement avec nos prestataires de
                confiance (transporteurs, hébergeur) pour l'exécution du service.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">6. Vos droits</h2>
              <p>
                Conformément à la loi 09-08 relative à la protection des données personnelles au Maroc, vous
                disposez d'un droit d'accès, de rectification, d'opposition et de suppression de vos données.
                Pour exercer ces droits, contactez-nous à{' '}
                <a href="mailto:contact@evoracouture.com" className="underline">contact@evoracouture.com</a>.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">7. Cookies</h2>
              <p>
                Notre site utilise des cookies techniques nécessaires à son fonctionnement (panier, session)
                ainsi que des cookies de mesure d'audience anonymisée.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">8. Contact</h2>
              <p>
                Pour toute question concernant cette politique, écrivez-nous à{' '}
                <a href="mailto:contact@evoracouture.com" className="underline">contact@evoracouture.com</a>.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

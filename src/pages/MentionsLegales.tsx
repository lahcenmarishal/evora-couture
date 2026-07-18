import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export default function MentionsLegales() {
  return (
    <div className="min-h-screen">
      <Header />
      <main className="pt-24 lg:pt-32 pb-20">
        <div className="container-fashion max-w-3xl">
          <h1 className="text-title mb-4">Mentions légales</h1>
          <p className="text-sm text-muted-foreground mb-12">Informations légales relatives au site evoracouture.com</p>

          <div className="space-y-10 text-body leading-relaxed text-muted-foreground">
            <section>
              <h2 className="text-caption text-foreground mb-4">Éditeur du site</h2>
              <ul className="space-y-1">
                <li>• <strong className="text-foreground">Raison sociale :</strong> EVORA COUTURE SARL</li>
                <li>• <strong className="text-foreground">Forme juridique :</strong> Société à Responsabilité Limitée</li>
                <li>• <strong className="text-foreground">Capital social :</strong> 100 000 DH</li>
                <li>• <strong className="text-foreground">Siège social :</strong> Casablanca, Maroc</li>
                <li>• <strong className="text-foreground">RC :</strong> XXXXXX — Casablanca</li>
                <li>• <strong className="text-foreground">ICE :</strong> XXXXXXXXXXXXXXX</li>
                <li>• <strong className="text-foreground">IF :</strong> XXXXXXXX</li>
                <li>• <strong className="text-foreground">Email :</strong> contact@evoracouture.com</li>
                <li>• <strong className="text-foreground">Téléphone :</strong> +212 600 000 000</li>
              </ul>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">Directeur de publication</h2>
              <p>Le directeur de la publication est le représentant légal de la société EVORA COUTURE SARL.</p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">Hébergement</h2>
              <p>
                Le site est hébergé par <strong className="text-foreground">Lovable Cloud</strong>. Le nom
                de domaine est enregistré auprès d'un prestataire agréé.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">Propriété intellectuelle</h2>
              <p>
                L'ensemble du contenu présent sur ce site (textes, images, logos, vidéos, graphismes,
                photographies de produits) est la propriété exclusive de EVORA COUTURE SARL et est protégé
                par les lois marocaines et internationales relatives à la propriété intellectuelle.
              </p>
              <p className="mt-4">
                Toute reproduction, représentation, modification ou exploitation, totale ou partielle, sans
                autorisation écrite préalable est strictement interdite.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">Conditions d'utilisation</h2>
              <p>
                L'utilisation du site evoracouture.com implique l'acceptation pleine et entière des
                présentes mentions légales. EVORA COUTURE se réserve le droit de modifier ces mentions à
                tout moment.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">Responsabilité</h2>
              <p>
                EVORA COUTURE met tout en œuvre pour offrir des informations exactes et à jour. Cependant,
                la société ne saurait être tenue responsable des omissions, inexactitudes ou carences dans
                la mise à jour.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">Droit applicable</h2>
              <p>
                Les présentes mentions légales sont soumises au droit marocain. En cas de litige, les
                tribunaux compétents de Casablanca seront seuls compétents.
              </p>
            </section>

            <section>
              <h2 className="text-caption text-foreground mb-4">Contact</h2>
              <p>
                Pour toute question, contactez-nous à{' '}
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

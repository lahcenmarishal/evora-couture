import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Ruler, Info } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const sizeData = [
  { size: 'XS', bust: '82-86', waist: '62-66', hips: '88-92', length: '140' },
  { size: 'S', bust: '86-90', waist: '66-70', hips: '92-96', length: '142' },
  { size: 'M', bust: '90-94', waist: '70-74', hips: '96-100', length: '144' },
  { size: 'L', bust: '94-98', waist: '74-78', hips: '100-104', length: '146' },
  { size: 'XL', bust: '98-102', waist: '78-82', hips: '104-108', length: '148' },
  { size: 'XXL', bust: '102-108', waist: '82-88', hips: '108-114', length: '150' },
];

const measurementTips = [
  {
    title: 'Tour de poitrine',
    description: 'Mesurez horizontalement à l\'endroit le plus fort de la poitrine, en gardant le mètre bien droit dans le dos.',
    icon: '📏',
  },
  {
    title: 'Tour de taille',
    description: 'Mesurez à l\'endroit le plus fin de votre taille, généralement au niveau du nombril ou légèrement au-dessus.',
    icon: '📐',
  },
  {
    title: 'Tour de hanches',
    description: 'Mesurez à l\'endroit le plus large de vos hanches, environ 20 cm sous la taille.',
    icon: '📏',
  },
  {
    title: 'Longueur',
    description: 'Mesurez du creux de l\'épaule jusqu\'à la cheville ou selon la longueur souhaitée.',
    icon: '📐',
  },
];

const sizingAdvice = [
  {
    question: 'Je suis entre deux tailles, que dois-je choisir ?',
    answer: 'Nos caftans sont conçues avec une coupe ample et fluide. Si vous êtes entre deux tailles, nous recommandons de prendre la taille inférieure pour un tombé élégant, ou la taille supérieure si vous préférez plus d\'aisance.',
  },
  {
    question: 'Les mesures correspondent-elles aux vêtements ou à mon corps ?',
    answer: 'Les mesures indiquées correspondent à vos mensurations corporelles. Nos caftans sont coupées avec l\'aisance nécessaire pour un confort optimal.',
  },
  {
    question: 'Proposez-vous des retouches ou du sur-mesure ?',
    answer: 'Oui, nous proposons un service de personnalisation pour ajuster la longueur des manches ou de l\'caftan selon vos besoins. Contactez-nous pour plus d\'informations.',
  },
  {
    question: 'Les tailles sont-elles standards ?',
    answer: 'Nos tailles suivent les standards européens avec une adaptation aux morphologies typiques de notre clientèle. Référez-vous toujours à nos mesures en cm pour un choix optimal.',
  },
];

export default function GuideTailles() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container-fashion">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-display-md mb-6">Guide des Tailles</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Trouvez votre taille parfaite grâce à notre guide détaillé. 
              Toutes les mesures sont en centimètres.
            </p>
          </div>

          <div className="max-w-4xl mx-auto space-y-16">
            {/* Size Table */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Ruler className="w-6 h-6 text-primary" />
                <h2 className="text-heading-md">Tableau des Tailles</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border border-border">
                  <thead className="bg-primary text-primary-foreground">
                    <tr>
                      <th className="p-4 text-left text-caption">Taille</th>
                      <th className="p-4 text-center text-caption">Tour de poitrine</th>
                      <th className="p-4 text-center text-caption">Tour de taille</th>
                      <th className="p-4 text-center text-caption">Tour de hanches</th>
                      <th className="p-4 text-center text-caption">Longueur</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sizeData.map((row, index) => (
                      <tr 
                        key={row.size} 
                        className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-secondary/50'}`}
                      >
                        <td className="p-4 font-medium text-lg">{row.size}</td>
                        <td className="p-4 text-center text-muted-foreground">{row.bust} cm</td>
                        <td className="p-4 text-center text-muted-foreground">{row.waist} cm</td>
                        <td className="p-4 text-center text-muted-foreground">{row.hips} cm</td>
                        <td className="p-4 text-center text-muted-foreground">{row.length} cm</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* How to Measure */}
            <section>
              <div className="flex items-center gap-3 mb-8">
                <Info className="w-6 h-6 text-primary" />
                <h2 className="text-heading-md">Comment Prendre vos Mesures</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {measurementTips.map((tip, index) => (
                  <div key={index} className="p-6 border border-border bg-secondary/30">
                    <div className="text-3xl mb-4">{tip.icon}</div>
                    <h3 className="text-body-lg font-medium mb-2">{tip.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {tip.description}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 p-6 bg-primary/5 border border-primary/20">
                <h4 className="font-medium mb-3">💡 Conseils pour une mesure précise</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li>• Utilisez un mètre ruban souple, pas une règle rigide</li>
                  <li>• Prenez vos mesures en sous-vêtements ou vêtements fins</li>
                  <li>• Tenez-vous droite, détendue, les bras le long du corps</li>
                  <li>• Faites-vous aider si possible pour plus de précision</li>
                </ul>
              </div>
            </section>

            {/* FAQ */}
            <section>
              <h2 className="text-heading-md mb-8 pb-4 border-b border-border">
                Questions Fréquentes sur les Tailles
              </h2>
              
              <Accordion type="single" collapsible className="space-y-2">
                {sizingAdvice.map((item, index) => (
                  <AccordionItem 
                    key={index} 
                    value={`item-${index}`}
                    className="border border-border px-6"
                  >
                    <AccordionTrigger className="text-left text-body-lg hover:no-underline">
                      {item.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground leading-relaxed">
                      {item.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </section>

            {/* Contact CTA */}
            <div className="text-center p-12 bg-secondary">
              <h3 className="text-heading-sm mb-4">Besoin d'aide pour choisir votre taille ?</h3>
              <p className="text-muted-foreground mb-8">
                Notre équipe vous conseille personnellement pour trouver la coupe parfaite.
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

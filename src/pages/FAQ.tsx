import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqCategories = [
  {
    title: 'Commandes & Paiements',
    questions: [
      {
        question: 'Comment passer une commande ?',
        answer: 'Pour passer une commande, parcourez notre collection, sélectionnez les articles souhaités, choisissez votre taille et ajoutez-les au panier. Procédez ensuite au paiement en remplissant vos informations de livraison.',
      },
      {
        question: 'Quels modes de paiement acceptez-vous ?',
        answer: 'Nous acceptons actuellement le paiement à la livraison (Cash on Delivery) pour le Maroc. D\'autres options de paiement seront bientôt disponibles.',
      },
      {
        question: 'Puis-je modifier ma commande après validation ?',
        answer: 'Vous pouvez modifier votre commande dans les 2 heures suivant sa validation en nous contactant par WhatsApp ou email. Passé ce délai, la commande est en préparation.',
      },
      {
        question: 'Comment suivre ma commande ?',
        answer: 'Vous recevrez un email de confirmation avec un numéro de suivi dès l\'expédition de votre commande. Vous pouvez également nous contacter pour connaître le statut.',
      },
    ],
  },
  {
    title: 'Produits & Tailles',
    questions: [
      {
        question: 'Comment choisir ma taille ?',
        answer: 'Consultez notre Guide des Tailles disponible sur chaque fiche produit. Nous proposons des mesures détaillées pour vous aider à trouver la coupe parfaite. En cas de doute, n\'hésitez pas à nous contacter.',
      },
      {
        question: 'Les couleurs sont-elles fidèles aux photos ?',
        answer: 'Nous nous efforçons de reproduire les couleurs le plus fidèlement possible. Toutefois, les paramètres d\'écran peuvent légèrement modifier les teintes. Les descriptions mentionnent les nuances exactes.',
      },
      {
        question: 'Comment entretenir mon caftan ?',
        answer: 'Nous recommandons un lavage à la main ou en machine sur cycle délicat à 30°C. Évitez le sèche-linge et préférez un séchage à plat. Le repassage doit se faire à basse température.',
      },
    ],
  },
  {
    title: 'Livraison',
    questions: [
      {
        question: 'Quels sont les délais de livraison ?',
        answer: 'La livraison standard au Maroc prend 2-5 jours ouvrables selon votre ville. Les grandes villes (Casablanca, Rabat, Marrakech) sont généralement livrées sous 2-3 jours.',
      },
      {
        question: 'Livrez-vous à l\'international ?',
        answer: 'Oui, nous livrons à l\'international ! Les délais varient de 5 à 15 jours selon la destination. Les frais sont calculés au moment du checkout.',
      },
      {
        question: 'Puis-je modifier mon adresse de livraison ?',
        answer: 'Contactez-nous rapidement si vous souhaitez modifier votre adresse. Si la commande n\'est pas encore expédiée, nous pourrons effectuer le changement.',
      },
    ],
  },
  {
    title: 'Retours & Échanges',
    questions: [
      {
        question: 'Quelle est votre politique de retour ?',
        answer: 'Vous disposez de 14 jours après réception pour retourner un article non porté, avec ses étiquettes. Les articles sur-mesure ne sont pas éligibles au retour.',
      },
      {
        question: 'Comment effectuer un échange ?',
        answer: 'Contactez-nous par WhatsApp ou email avec votre numéro de commande. Nous organiserons l\'échange une fois l\'article initial retourné.',
      },
      {
        question: 'Les frais de retour sont-ils à ma charge ?',
        answer: 'Les frais de retour sont à la charge du client sauf en cas de défaut de fabrication ou d\'erreur de notre part.',
      },
    ],
  },
];

export default function FAQ() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container-fashion">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-display-md mb-6">Questions Fréquentes</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Retrouvez les réponses aux questions les plus courantes. 
              Si vous ne trouvez pas ce que vous cherchez, n'hésitez pas à nous contacter.
            </p>
          </div>

          {/* FAQ Categories */}
          <div className="max-w-3xl mx-auto space-y-12">
            {faqCategories.map((category, index) => (
              <div key={index}>
                <h2 className="text-heading-md mb-6 pb-4 border-b border-border">
                  {category.title}
                </h2>
                <Accordion type="single" collapsible className="space-y-2">
                  {category.questions.map((faq, faqIndex) => (
                    <AccordionItem 
                      key={faqIndex} 
                      value={`${index}-${faqIndex}`}
                      className="border border-border px-6"
                    >
                      <AccordionTrigger className="text-left text-body-lg hover:no-underline">
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground leading-relaxed">
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            ))}
          </div>

          {/* Contact CTA */}
          <div className="mt-20 text-center p-12 bg-secondary">
            <h3 className="text-heading-sm mb-4">Vous n'avez pas trouvé votre réponse ?</h3>
            <p className="text-muted-foreground mb-8">
              Notre équipe est disponible pour vous aider du lundi au samedi.
            </p>
            <a
              href="/contact"
              className="inline-block px-10 py-4 bg-primary text-primary-foreground text-caption hover:bg-primary/90 transition-colors"
            >
              Nous contacter
            </a>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

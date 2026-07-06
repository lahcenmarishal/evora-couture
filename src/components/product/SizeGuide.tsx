import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Ruler, Info, ChevronDown } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";

const sizeData = [
  { size: "XS", tour_poitrine: "82-86", tour_taille: "62-66", tour_hanches: "88-92", longueur: "135" },
  { size: "S", tour_poitrine: "86-90", tour_taille: "66-70", tour_hanches: "92-96", longueur: "138" },
  { size: "M", tour_poitrine: "90-94", tour_taille: "70-74", tour_hanches: "96-100", longueur: "140" },
  { size: "L", tour_poitrine: "94-98", tour_taille: "74-78", tour_hanches: "100-104", longueur: "142" },
  { size: "XL", tour_poitrine: "98-102", tour_taille: "78-82", tour_hanches: "104-108", longueur: "144" },
  { size: "XXL", tour_poitrine: "102-106", tour_taille: "82-86", tour_hanches: "108-112", longueur: "146" },
];

const measurementTips = [
  {
    title: "Tour de poitrine",
    description: "Mesurez horizontalement à l'endroit le plus fort de la poitrine, en passant sous les aisselles.",
    icon: "📏"
  },
  {
    title: "Tour de taille",
    description: "Mesurez au niveau le plus creux de la taille, généralement au-dessus du nombril.",
    icon: "📐"
  },
  {
    title: "Tour de hanches",
    description: "Mesurez à l'endroit le plus large des hanches, environ 20 cm sous la taille.",
    icon: "📏"
  },
  {
    title: "Longueur",
    description: "Mesurez du haut de l'épaule jusqu'à la cheville pour une caftan qui tombe parfaitement.",
    icon: "📐"
  }
];

const sizingAdvice = [
  {
    question: "Je suis entre deux tailles, que choisir ?",
    answer: "Pour une coupe fluide et confortable, nous recommandons de prendre la taille supérieure. Nos caftans sont conçues avec une coupe ample qui permet une liberté de mouvement tout en restant élégantes."
  },
  {
    question: "Comment choisir la bonne longueur ?",
    answer: "Votre taille corporelle influence la longueur idéale. Si vous mesurez moins de 1m60, optez pour une taille XS ou S. Entre 1m60 et 1m70, les tailles M ou L sont parfaites. Au-delà de 1m70, privilégiez les tailles XL ou XXL."
  },
  {
    question: "Puis-je retoucher mon caftan ?",
    answer: "Absolument ! Nos caftans peuvent être facilement ajustées par une couturière. Cependant, nous recommandons de prendre la bonne longueur dès l'achat pour préserver les finitions originales."
  },
  {
    question: "Quelle taille pour un style oversize ?",
    answer: "Pour un look tendance oversize, prenez une à deux tailles au-dessus de votre taille habituelle. Cela créera un effet décontracté tout en restant chic."
  }
];

interface SizeGuideProps {
  selectedSize?: string;
  onSizeSelect?: (size: string) => void;
}

export function SizeGuide({ selectedSize, onSizeSelect }: SizeGuideProps) {
  const [hoveredSize, setHoveredSize] = useState<string | null>(null);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground hover:text-foreground gap-2">
          <Ruler className="h-4 w-4" />
          Guide des tailles
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-cormorant text-2xl">Guide des Tailles</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Tableau des tailles */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span className="text-lg">📊</span>
              Tableau des mesures (en cm)
            </h3>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold">Taille</TableHead>
                    <TableHead className="text-center">Poitrine</TableHead>
                    <TableHead className="text-center">Taille</TableHead>
                    <TableHead className="text-center">Hanches</TableHead>
                    <TableHead className="text-center">Longueur</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sizeData.map((row) => (
                    <TableRow
                      key={row.size}
                      className={cn(
                        "cursor-pointer transition-colors",
                        selectedSize === row.size && "bg-primary/10",
                        hoveredSize === row.size && "bg-muted/50"
                      )}
                      onMouseEnter={() => setHoveredSize(row.size)}
                      onMouseLeave={() => setHoveredSize(null)}
                      onClick={() => onSizeSelect?.(row.size)}
                    >
                      <TableCell className="font-semibold">{row.size}</TableCell>
                      <TableCell className="text-center">{row.tour_poitrine}</TableCell>
                      <TableCell className="text-center">{row.tour_taille}</TableCell>
                      <TableCell className="text-center">{row.tour_hanches}</TableCell>
                      <TableCell className="text-center">{row.longueur}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Comment mesurer */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span className="text-lg">📏</span>
              Comment prendre vos mesures
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {measurementTips.map((tip, index) => (
                <motion.div
                  key={tip.title}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="p-4 bg-muted/30 rounded-lg border"
                >
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{tip.icon}</span>
                    <div>
                      <h4 className="font-medium text-sm">{tip.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{tip.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Conseils de choix */}
          <div>
            <h3 className="font-medium mb-3 flex items-center gap-2">
              <span className="text-lg">💡</span>
              Conseils de choix
            </h3>
            <Accordion type="single" collapsible className="w-full">
              {sizingAdvice.map((advice, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-sm hover:no-underline">
                    {advice.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm text-muted-foreground">
                    {advice.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>

          {/* Note importante */}
          <div className="flex items-start gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
            <Info className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
            <div>
              <h4 className="font-medium text-sm">Besoin d'aide ?</h4>
              <p className="text-xs text-muted-foreground mt-1">
                Notre équipe est à votre disposition pour vous conseiller sur le choix de votre taille. 
                N'hésitez pas à nous contacter par email ou WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

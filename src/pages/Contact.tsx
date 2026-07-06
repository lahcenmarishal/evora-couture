import { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Mail, Phone, MapPin, Clock, Send, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { z } from 'zod';

const contactSchema = z.object({
  name: z.string().trim().min(2, 'Le nom doit contenir au moins 2 caractères').max(100),
  email: z.string().trim().email('Email invalide').max(255),
  phone: z.string().trim().optional(),
  subject: z.string().trim().min(5, 'L\'objet doit contenir au moins 5 caractères').max(200),
  message: z.string().trim().min(20, 'Le message doit contenir au moins 20 caractères').max(2000),
});

const contactInfo = [
  {
    icon: MessageCircle,
    title: 'WhatsApp',
    value: '+212 6 00 00 00 00',
    description: 'Réponse rapide',
    href: 'https://wa.me/212600000000',
  },
  {
    icon: Mail,
    title: 'Email',
    value: 'contact@evoracouture.com',
    description: 'Sous 24h',
    href: 'mailto:contact@evoracouture.com',
  },
  {
    icon: Phone,
    title: 'Téléphone',
    value: '+212 5 00 00 00 00',
    description: 'Lun-Sam 9h-18h',
    href: 'tel:+212500000000',
  },
  {
    icon: MapPin,
    title: 'Showroom',
    value: 'Casablanca, Maroc',
    description: 'Sur rendez-vous',
    href: '#',
  },
];

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    
    // Validate form
    const result = contactSchema.safeParse(formData);
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.errors.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast.success('Message envoyé !', {
      description: 'Nous vous répondrons dans les plus brefs délais.',
    });
    
    setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-32 pb-20">
        <div className="container-fashion">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-display-md mb-6">Contactez-nous</h1>
            <p className="text-body text-muted-foreground max-w-2xl mx-auto">
              Une question, une demande spéciale ou simplement envie de nous dire bonjour ? 
              Nous sommes à votre écoute.
            </p>
          </div>

          {/* Contact Info Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
            {contactInfo.map((info, index) => (
              <a
                key={index}
                href={info.href}
                target={info.href.startsWith('http') ? '_blank' : undefined}
                rel={info.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                className="group p-8 border border-border hover:border-primary/50 hover:bg-secondary/30 transition-all duration-300"
              >
                <info.icon className="w-8 h-8 mb-4 text-primary group-hover:scale-110 transition-transform" />
                <h3 className="text-body-lg font-medium mb-1">{info.title}</h3>
                <p className="text-foreground mb-2">{info.value}</p>
                <p className="text-sm text-muted-foreground">{info.description}</p>
              </a>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div>
              <h2 className="text-heading-md mb-8">Envoyez-nous un message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet *</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Votre nom"
                      className={errors.name ? 'border-destructive' : ''}
                    />
                    {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="votre@email.com"
                      className={errors.email ? 'border-destructive' : ''}
                    />
                    {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+212 6 00 00 00 00"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="subject">Objet *</Label>
                    <Input
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Sujet de votre message"
                      className={errors.subject ? 'border-destructive' : ''}
                    />
                    {errors.subject && <p className="text-sm text-destructive">{errors.subject}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Comment pouvons-nous vous aider ?"
                    rows={6}
                    className={errors.message ? 'border-destructive' : ''}
                  />
                  {errors.message && <p className="text-sm text-destructive">{errors.message}</p>}
                </div>

                <Button 
                  type="submit" 
                  className="w-full py-6"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    'Envoi en cours...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Envoyer le message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Additional Info */}
            <div className="space-y-12">
              <div>
                <h2 className="text-heading-md mb-8">Horaires d'ouverture</h2>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 bg-secondary/50">
                    <Clock className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">Lundi - Samedi</p>
                      <p className="text-muted-foreground">9h00 - 18h00</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 bg-secondary/50">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">Dimanche</p>
                      <p className="text-muted-foreground">Fermé</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h2 className="text-heading-md mb-8">Questions fréquentes</h2>
                <div className="space-y-4 text-muted-foreground">
                  <p>
                    Avant de nous contacter, consultez notre{' '}
                    <a href="/faq" className="text-primary hover:underline">FAQ</a>{' '}
                    pour trouver rapidement les réponses aux questions courantes.
                  </p>
                  <p>
                    Pour les questions sur les tailles, consultez notre{' '}
                    <a href="/guide-tailles" className="text-primary hover:underline">Guide des Tailles</a>.
                  </p>
                  <p>
                    Pour les retours et échanges, visitez notre page{' '}
                    <a href="/livraison" className="text-primary hover:underline">Livraison & Retours</a>.
                  </p>
                </div>
              </div>

              <div className="p-8 bg-primary text-primary-foreground">
                <h3 className="text-heading-sm mb-4">Réponse prioritaire via WhatsApp</h3>
                <p className="text-primary-foreground/80 mb-6">
                  Pour une réponse rapide, contactez-nous directement sur WhatsApp. 
                  Notre équipe vous répond généralement en moins d'une heure pendant les heures d'ouverture.
                </p>
                <a
                  href="https://wa.me/212600000000"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary-foreground text-primary hover:bg-primary-foreground/90 transition-colors"
                >
                  <MessageCircle className="w-5 h-5" />
                  Discuter sur WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

// Product data types and mock data
import caftanRoseGold from '@/assets/caftan-rose-gold.jpg';
import caftanBrun from '@/assets/caftan-brun.jpg';
import caftanRiad from '@/assets/caftan-riad.jpg';
import caftanBordeaux from '@/assets/caftan-bordeaux.jpg';
import caftanBlanc from '@/assets/caftan-blanc-mariage.jpg';
import caftanArgent from '@/assets/caftan-argent.jpg';
import caftanViolet from '@/assets/caftan-violet.jpg';
import caftanVioletFleuri from '@/assets/caftan-violet-fleuri.jpg';

export interface ProductVariant {
  size: string;
  color: string;
  stock: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  category: string;
  price: number;
  originalPrice?: number;
  description: string;
  images: string[];
  variants: ProductVariant[];
  isNew?: boolean;
  isBestseller?: boolean;
  isFeatured?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
}

export const categories: Category[] = [
  { id: '1', name: 'Caftans Traditionnels', slug: 'caftans-traditionnels', image: caftanBrun },
  { id: '2', name: 'Caftans Brodés', slug: 'caftans-brodes', image: caftanRoseGold },
  { id: '3', name: 'Occasions', slug: 'occasions', image: caftanArgent },
  { id: '4', name: 'Nouvelle Collection', slug: 'nouvelle-collection', image: caftanRiad },
];

export const products: Product[] = [
  {
    id: '1',
    name: 'Caftan Rose Gold Nuptial',
    slug: 'caftan-rose-gold-nuptial',
    category: 'caftans-brodes',
    price: 3890.00,
    originalPrice: 4290.00,
    description: 'Caftan somptueux en tissu rose gold, entièrement brodé à la main de motifs floraux dorés. Ceinture bijou incluse. Une pièce d\'exception pour votre mariage ou vos cérémonies les plus prestigieuses.',
    images: [caftanRoseGold],
    variants: [
      { size: 'S', color: 'Rose Gold', stock: 3 },
      { size: 'M', color: 'Rose Gold', stock: 5 },
      { size: 'L', color: 'Rose Gold', stock: 4 },
      { size: 'XL', color: 'Rose Gold', stock: 2 },
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: '2',
    name: 'Caftan Velours Brun Doré',
    slug: 'caftan-velours-brun-dore',
    category: 'caftans-traditionnels',
    price: 3290.00,
    description: 'Caftan en velours brun profond avec broderies dorées traditionnelles. Coupe majestueuse rehaussée d\'une ceinture bijou finement travaillée. L\'incarnation du luxe marocain.',
    images: [caftanBrun, caftanRiad],
    variants: [
      { size: 'S', color: 'Brun', stock: 4 },
      { size: 'M', color: 'Brun', stock: 6 },
      { size: 'L', color: 'Brun', stock: 5 },
      { size: 'XL', color: 'Brun', stock: 3 },
    ],
    isBestseller: true,
    isFeatured: true,
  },
  {
    id: '3',
    name: 'Caftan Signature Riad',
    slug: 'caftan-signature-riad',
    category: 'caftans-traditionnels',
    price: 3590.00,
    description: 'Notre pièce signature inspirée des riads marocains. Velours brun aux broderies or délicates, silhouette élégante et intemporelle pour vos plus belles occasions.',
    images: [caftanRiad, caftanBrun],
    variants: [
      { size: 'S', color: 'Brun Doré', stock: 3 },
      { size: 'M', color: 'Brun Doré', stock: 5 },
      { size: 'L', color: 'Brun Doré', stock: 4 },
      { size: 'XL', color: 'Brun Doré', stock: 2 },
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: '4',
    name: 'Caftan Bordeaux Prestige',
    slug: 'caftan-bordeaux-prestige',
    category: 'caftans-brodes',
    price: 3790.00,
    description: 'Caftan en velours bordeaux avec broderies or et rose. Ceinture bijou en cristal. Une pièce théâtrale qui capture la lumière et sublime la silhouette.',
    images: [caftanBordeaux],
    variants: [
      { size: 'S', color: 'Bordeaux', stock: 3 },
      { size: 'M', color: 'Bordeaux', stock: 4 },
      { size: 'L', color: 'Bordeaux', stock: 6 },
      { size: 'XL', color: 'Bordeaux', stock: 2 },
    ],
    isBestseller: true,
    isFeatured: true,
  },
  {
    id: '5',
    name: 'Caftan Nuptial Blanc Perlé',
    slug: 'caftan-nuptial-blanc-perle',
    category: 'occasions',
    price: 5290.00,
    description: 'Robe de mariée caftan en dentelle blanche perlée avec voile assorti. Broderies délicates et perles cousues main. La quintessence de l\'élégance nuptiale marocaine.',
    images: [caftanBlanc],
    variants: [
      { size: 'S', color: 'Blanc Perlé', stock: 2 },
      { size: 'M', color: 'Blanc Perlé', stock: 3 },
      { size: 'L', color: 'Blanc Perlé', stock: 2 },
      { size: 'XL', color: 'Blanc Perlé', stock: 1 },
    ],
    isNew: true,
    isFeatured: true,
  },
  {
    id: '6',
    name: 'Caftan Argent Cristal',
    slug: 'caftan-argent-cristal',
    category: 'occasions',
    price: 4590.00,
    description: 'Caftan gris argenté orné de cristaux et broderies argent. Coupe majestueuse et ceinture bijou spectaculaire. Pour briller lors de vos plus grands événements.',
    images: [caftanArgent],
    variants: [
      { size: 'S', color: 'Argent', stock: 2 },
      { size: 'M', color: 'Argent', stock: 4 },
      { size: 'L', color: 'Argent', stock: 3 },
      { size: 'XL', color: 'Argent', stock: 2 },
    ],
    isBestseller: true,
  },
  {
    id: '7',
    name: 'Caftan Violet Aristocrate',
    slug: 'caftan-violet-aristocrate',
    category: 'caftans-brodes',
    price: 3390.00,
    description: 'Caftan violet et vert avec broderies argentées et perles nacrées. Un jeu de couleurs audacieux pour une allure aristocratique et raffinée.',
    images: [caftanViolet],
    variants: [
      { size: 'S', color: 'Violet', stock: 3 },
      { size: 'M', color: 'Violet', stock: 5 },
      { size: 'L', color: 'Violet', stock: 4 },
      { size: 'XL', color: 'Violet', stock: 2 },
    ],
    isNew: true,
  },
  {
    id: '8',
    name: 'Caftan Violet Fleuri Doré',
    slug: 'caftan-violet-fleuri-dore',
    category: 'nouvelle-collection',
    price: 3690.00,
    description: 'Caftan violet aux motifs floraux multicolores et broderies dorées luxuriantes. Ceinture bijou dorée assortie. L\'exubérance maîtrisée du savoir-faire marocain.',
    images: [caftanVioletFleuri],
    variants: [
      { size: 'S', color: 'Violet Fleuri', stock: 3 },
      { size: 'M', color: 'Violet Fleuri', stock: 4 },
      { size: 'L', color: 'Violet Fleuri', stock: 5 },
      { size: 'XL', color: 'Violet Fleuri', stock: 2 },
    ],
    isFeatured: true,
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(categorySlug: string): Product[] {
  return products.filter(p => p.category === categorySlug);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isFeatured);
}

export function getBestsellers(): Product[] {
  return products.filter(p => p.isBestseller);
}

export function getNewArrivals(): Product[] {
  return products.filter(p => p.isNew);
}

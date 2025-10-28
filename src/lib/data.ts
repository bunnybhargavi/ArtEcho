import type { Artisan, Product } from './types';

export let artisans: Artisan[] = [
  {
    id: '1',
    name: 'Rama Devi',
    craft: 'Pottery',
    location: 'Kumbharwada, Rajasthan',
    story:
      'Rama Devi comes from a long line of potters in Rajasthan. Her terracotta creations reflect the earthy tones and textures of her village, blending traditional motifs with everyday functionality.',
  },
  {
    id: '2',
    name: 'Arjun Patel',
    craft: 'Woodcraft',
    location: 'Saharanpur, Uttar Pradesh',
    story:
      'Arjun learned woodworking from his father, a master craftsman. His precision and artistry turn local teak and rosewood into elegant furniture and kitchenware admired across India.',
  },
  {
    id: '3',
    name: 'Ayesha Khan',
    craft: 'Textiles',
    location: 'Jaipur, Rajasthan',
    story:
      'Ayesha specializes in block printing and handloom weaving. Every fabric she creates tells a story — of heritage, patience, and the beauty of handmade artistry.',
  },
  {
    id: '4',
    name: 'Vikram Nair',
    craft: 'Glass Art',
    location: 'Firozabad, Uttar Pradesh',
    story:
      'Vikram has spent two decades perfecting the art of glassblowing in Firozabad, India’s glass capital. His pieces shimmer with vibrant color and meticulous craftsmanship.',
  },
];

export let products: Product[] = [
  {
    id: '1',
    name: 'Terracotta Chai Cup Set',
    description:
      'A handcrafted set of earthy terracotta cups, perfect for your evening chai. Made using traditional clay techniques from Rajasthan.',
    price: 450,
    tags: ['terracotta', 'ceramics', 'handmade'],
    imageId: 'product-1',
    imageHoverId: 'product-1-hover',
    artisanId: '1',
    badge: 'Best Seller',
    rating: 4.8,
    reviews: 132,
  },
  {
    id: '2',
    name: 'Jaipur Handloom Throw',
    description:
      'Soft cotton throw handwoven using natural dyes and block printing patterns inspired by Rajasthani artistry.',
    price: 1899,
    tags: ['textile', 'handloom', 'blockprint'],
    imageId: 'product-2',
    artisanId: '3',
    badge: 'New Arrival',
    rating: 4.9,
    reviews: 48,
  },
  {
    id: '3',
    name: 'Silver Tribal Pendant',
    description:
      'An elegant handcrafted pendant featuring tribal motifs from Odisha. Made with pure silver and finished with traditional etching techniques.',
    price: 2250,
    tags: ['jewelry', 'silver', 'tribal'],
    imageId: 'product-3',
    artisanId: '2',
    badge: 'Handcrafted',
    rating: 4.7,
    reviews: 67,
  },
  {
    id: '4',
    name: 'Teak Wood Cutting Board',
    description:
      'Crafted from sustainable teak wood, this board is smooth, durable, and perfect for both kitchen prep and presentation.',
    price: 1399,
    tags: ['woodwork', 'kitchen', 'teak'],
    imageId: 'product-4',
    artisanId: '2',
    rating: 5.0,
    reviews: 210,
  },
  {
    id: '5',
    name: 'Madhubani Wall Painting',
    description:
      'A vibrant hand-painted Madhubani artwork depicting Indian folk tales. Each stroke reflects the culture and spirit of Bihar.',
    price: 3500,
    tags: ['painting', 'folk art', 'madhubani'],
    imageId: 'product-5',
    artisanId: '3',
    badge: 'New',
    rating: 4.6,
    reviews: 25,
  },
  {
    id: '6',
    name: 'Firozabad Swirl Glass Tumblers',
    description:
      'Set of two hand-blown glass tumblers with colorful swirls. Each piece is unique, made in the glass-blowing hub of Firozabad.',
    price: 950,
    tags: ['glass', 'drinkware', 'handblown'],
    imageId: 'product-6',
    artisanId: '4',
    badge: 'Made to Order',
    rating: 4.8,
    reviews: 54,
  },
  {
    id: '7',
    name: 'Rosewood Lunch Box',
    description:
      'A beautifully finished two-tiered lunch box crafted from rosewood. Perfect for an elegant, eco-friendly meal on the go.',
    price: 2100,
    tags: ['woodwork', 'eco-friendly', 'lunchbox'],
    imageId: 'product-7',
    artisanId: '2',
    rating: 4.9,
    reviews: 84,
  },
  {
    id: '8',
    name: 'Kutch Embroidered Cushion Cover',
    description:
      'Vibrant hand-embroidered cushion cover from Gujarat. Each piece carries the colorful essence of Kutch embroidery.',
    price: 799,
    tags: ['textile', 'embroidery', 'home decor'],
    imageId: 'product-8',
    artisanId: '3',
    badge: 'Best Seller',
    rating: 4.7,
    reviews: 101,
  },
  {
    id: '9',
    name: 'Clay Matka Pot',
    description:
      'A handcrafted clay pot made using traditional methods, ideal for naturally cooling and storing water — the sustainable way.',
    price: 599,
    tags: ['clay', 'pottery', 'eco'],
    imageId: 'product-9',
    artisanId: '1',
    rating: 4.5,
    reviews: 73,
  },
];

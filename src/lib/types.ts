export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageId: string;
  imageHoverId?: string; // Optional secondary image for hover
  artisanId: string;
  badge?: 'New' | 'Best Seller' | 'Made to Order' | 'Handcrafted'; // Product badges
  rating: number; // Star rating (e.g., 4.5)
  reviews: number; // Number of reviews
}

export interface Artisan {
  id: string;
  name: string;
  craft: string;
  location: string;
  story: string;
}

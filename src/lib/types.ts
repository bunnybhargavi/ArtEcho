export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  tags: string[];
  imageId: string;
  artisanId: string;
}

export interface Artisan {
  id: string;
  name: string;
  craft: string;
  location: string;
  story: string;
}

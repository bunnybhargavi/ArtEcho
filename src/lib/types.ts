
import { z } from 'zod';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number; // Previous price, for showing discounts
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

export interface OrderItem {
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
}

export interface TrackingEvent {
  status: string;
  location: string;
  timestamp: string; // ISO date string
}


export type OrderStatus = 'Placed' | 'Shipped' | 'On the way' | 'Out for delivery' | 'Delivered' | 'Cancelled';

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  createdAt: string; // ISO date string
  expectedDelivery?: string; // ISO date string
  statusHistory?: TrackingEvent[];
}


export const GenerateAudioFromTextInputSchema = z.object({
  text: z.string().min(1).describe('The text to be converted to speech.'),
});
export type GenerateAudioFromTextInput = z.infer<typeof GenerateAudioFromTextInputSchema>;

export const GenerateAudioFromTextOutputSchema = z.object({
  audioDataUri: z.string().describe('A data URI for the audio recording of the provided text.'),
});
export type GenerateAudioFromTextOutput = z.infer<typeof GenerateAudioFromTextOutputSchema>;

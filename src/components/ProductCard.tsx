
'use client';

import Image from 'next/image';
import type { Product, Artisan } from '@/lib/types';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from './ui/badge';
import { Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  artisan?: Artisan;
  onImageClick?: (product: Product, artisan?: Artisan) => void;
  className?: string;
}

const badgeColorClasses = {
  'New': 'bg-pink-100 text-pink-800',
  'Best Seller': 'bg-purple-100 text-purple-800',
  'Made to Order': 'bg-blue-100 text-blue-800',
  'Handcrafted': 'bg-green-100 text-green-800',
};

export function ProductCard({ product, artisan, onImageClick, className }: ProductCardProps) {
  const mainImage = PlaceHolderImages.find((img) => img.id === product.imageId);
  const hoverImage = product.imageHoverId ? PlaceHolderImages.find((img) => img.id === product.imageHoverId) : null;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    // We only trigger the quick view if the user clicks the image area.
    // This allows other elements on the card (like a link) to be clickable.
    if (onImageClick && (e.target as HTMLElement).closest('.product-image-container')) {
      e.preventDefault();
      onImageClick(product, artisan);
    }
  };

  return (
    <Card
      className={`overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}
      onClick={handleCardClick}
    >
      <CardHeader className="p-0">
        <div className="relative aspect-square product-image-container cursor-pointer">
          {product.badge && (
            <Badge className={`absolute top-2 left-2 z-10 border-none ${badgeColorClasses[product.badge] || 'bg-gray-100 text-gray-800'}`}>
              {product.badge}
            </Badge>
          )}

          {/* Main Image */}
          {mainImage ? (
            <Image
              src={mainImage.imageUrl}
              alt={product.name}
              fill
              className={`object-cover transition-opacity duration-300 ${hoverImage ? 'group-hover:opacity-0' : ''}`}
              data-ai-hint={mainImage.imageHint}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
          )}

          {/* Hover Image */}
          {hoverImage && (
            <Image
              src={hoverImage.imageUrl}
              alt={`${product.name} (hover)`}
              fill
              className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
              data-ai-hint={hoverImage.imageHint}
            />
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4 flex-grow flex flex-col">
        <h3 className="font-headline text-lg font-semibold leading-tight">
          {product.name}
        </h3>
        {artisan && (
          <p className="text-sm text-muted-foreground mt-1">
            by {artisan.name}
          </p>
        )}
        
        <div className="flex items-center gap-1 mt-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.floor(product.rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
              }`}
            />
          ))}
          <span className="text-xs text-muted-foreground ml-1">({product.reviews})</span>
        </div>

      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge variant="secondary" className="font-mono text-sm">
          ${product.price.toFixed(2)}
        </Badge>
      </CardFooter>
    </Card>
  );
}

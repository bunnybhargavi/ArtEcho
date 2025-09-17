
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

interface ProductCardProps {
  product: Product;
  artisan?: Artisan;
}

export function ProductCard({ product, artisan }: ProductCardProps) {
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  return (
    <Card className="overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative aspect-square">
          {image ? (
            <Image
              src={image.imageUrl}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              data-ai-hint={image.imageHint}
            />
          ) : (
            <div className="w-full h-full bg-muted flex items-center justify-center">
              <span className="text-muted-foreground text-sm">No Image</span>
            </div>
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
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Badge variant="secondary" className="font-mono text-sm">
          ${product.price.toFixed(2)}
        </Badge>
      </CardFooter>
    </Card>
  );
}

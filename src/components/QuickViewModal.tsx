
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Artisan } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';

interface QuickViewModalProps {
  product: Product;
  artisan: Artisan;
  isOpen: boolean;
  onClose: () => void;
}

export default function QuickViewModal({ product, artisan, isOpen, onClose }: QuickViewModalProps) {
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);
  const { addToCart } = useCartStore();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (image) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: image.imageUrl,
        quantity: 1,
      });
      toast({
        title: "Added to cart ✅",
        description: `${product.name} has been added to your cart.`,
      });
    } else {
       toast({
        variant: "destructive",
        title: "Could not add to cart",
        description: `Image URL not found for ${product.name}.`,
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl grid-rows-[auto_1fr_auto] p-0">
        <DialogHeader className="p-6 pb-0">
          <DialogTitle className="font-headline text-2xl md:text-3xl">{product.name}</DialogTitle>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 p-6 overflow-y-auto max-h-[70vh]">
          <div className="relative aspect-square">
            {image ? (
                <Image 
                  src={image.imageUrl} 
                  alt={`Quick view of ${product.name}, a piece of ${artisan.craft} by ${artisan.name}`} 
                  fill 
                  className="object-cover rounded-md" data-ai-hint={image.imageHint} 
                />
            ): (
                 <div className="w-full h-full bg-muted flex items-center justify-center rounded-md">
                    <span className="text-muted-foreground text-sm">No Image</span>
                </div>
            )}
          </div>
          
          <div className="flex flex-col space-y-4">
              <div>
                 <p className="text-sm text-muted-foreground">by {artisan.name}</p>
                 <p className="text-foreground/80 leading-relaxed mt-2 line-clamp-4">{product.description}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
              <div className="pt-4 mt-auto">
                 <span className="font-headline text-3xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                </span>
              </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/50 border-t flex items-center justify-end gap-2">
            <Button asChild variant="outline">
                <Link href={`/products/${product.id}`}>View Full Details</Link>
            </Button>
            <Button onClick={handleAddToCart}>
                <ShoppingCart className="mr-2 h-4 w-4" />
                Add to Cart
            </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

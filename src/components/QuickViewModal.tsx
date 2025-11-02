
'use client';

import Image from 'next/image';
import Link from 'next/link';
import type { Product, Artisan } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Share2, ArrowRight, Loader2 } from 'lucide-react';
import { useCartStore, type CartItem } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser } from '@/lib/auth-store';
import { placeSingleItemOrderAction } from '@/app/actions';
import PaymentDialog from './PaymentDialog';

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
  const router = useRouter();
  const [isBuying, setIsBuying] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { user } = useUser();

  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

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

  const handleBuyNow = () => {
     if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to place an order.',
      });
      router.push('/login');
      return;
    }
    setIsPaymentDialogOpen(true);
  };

  const confirmOrder = async () => {
    if (image && product) {
      setIsBuying(true);
      setIsPaymentDialogOpen(false);
      const item: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: image.imageUrl,
        quantity: 1,
      };

      try {
        const result = await placeSingleItemOrderAction(item);
        if (result.success && result.orderId) {
            toast({
                title: 'Order Placed!',
                description: 'Your order has been successfully placed.',
            });
            onClose(); // Close modal before redirecting
            router.push(`/tracking/${result.orderId}`);
        } else {
            throw new Error(result.error || 'Failed to place order.');
        }
      } catch (error: any) {
         toast({
          variant: 'destructive',
          title: 'Checkout Failed',
          description: error.message || 'There was a problem placing your order.',
        });
      } finally {
        setIsBuying(false);
      }
    }
  };


  const handleShare = async () => {
    const productUrl = `${window.location.origin}/products/${product.id}`;
    const shareData = {
      title: product.name,
      text: product.description,
      url: productUrl,
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(productUrl);
        toast({
          title: "Link copied!",
          description: "Product link copied to your clipboard.",
        });
      }
    } catch (error) {
      if ((error as DOMException).name !== 'AbortError') {
        console.error('Error sharing:', error);
         toast({
          variant: "destructive",
          title: "Failed to share",
          description: "Could not share or copy link.",
        });
      }
    }
  };

  return (
    <>
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
               {discountPercent > 0 && (
                <Badge variant="destructive" className="absolute top-2 left-2 z-10">
                  {discountPercent}% OFF
                </Badge>
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
                   <div className="flex items-baseline gap-2">
                      <span className="font-headline text-3xl font-bold text-primary">
                          Rs.{product.price}
                      </span>
                       {product.originalPrice && (
                          <span className="text-lg text-muted-foreground line-through">
                              Rs.{product.originalPrice}
                          </span>
                      )}
                  </div>
                </div>
            </div>
          </div>

          <DialogFooter className="p-6 bg-muted/50 border-t flex flex-col sm:flex-row items-center justify-between gap-2">
              <div className="flex gap-2">
                <Button asChild variant="outline" size="sm">
                    <Link href={`/products/${product.id}`}>View Details</Link>
                </Button>
                 <Button onClick={handleShare} variant="outline" size="sm">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share
                </Button>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                 <Button onClick={handleAddToCart} variant="secondary" className="w-full" disabled={isBuying}>
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                </Button>
                <Button onClick={handleBuyNow} className="w-full" disabled={isBuying}>
                  {isBuying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                    Buy Now
                </Button>
              </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onConfirm={confirmOrder}
        total={product.price}
      />
    </>
  );
}

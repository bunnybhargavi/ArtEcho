
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
import { Star, ShoppingCart, Loader2, Volume2, AlertTriangle, X } from 'lucide-react';
import { Button } from './ui/button';
import { useCartStore, type CartItem } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useUser, placeSingleItemOrderAction } from '@/lib/auth-store';
import PaymentDialog from './PaymentDialog';
import { generateArtisanStoryCardAction } from '@/app/actions';
import { Collapsible, CollapsibleContent } from './ui/collapsible';
import { Separator } from './ui/separator';

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
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const router = useRouter();
  const [isBuying, setIsBuying] = useState(false);
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const { user } = useUser();

  const [isStoryOpen, setIsStoryOpen] = useState(false);
  const [storyResult, setStoryResult] = useState<{ storyCardDescription: string; audioDataUri: string } | null>(null);
  const [isStoryLoading, setIsStoryLoading] = useState(false);
  const [storyError, setStoryError] = useState<string | null>(null);

  const discountPercent = product.originalPrice ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if ((e.target as HTMLElement).closest('button')) {
      return;
    }
    if (onImageClick && (e.target as HTMLElement).closest('.product-image-container')) {
      e.preventDefault();
      onImageClick(product, artisan);
    } else {
        router.push(`/products/${product.id}`);
    }
  };

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    if (mainImage) {
      addToCart({
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: mainImage.imageUrl,
        quantity: 1,
      });
      toast({
        title: "Added to cart ✅",
        description: `${product.name} has been added to your cart.`,
      });
    }
  };
  
  const handleBuyNow = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
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
  
  const handleToggleStory = async (e: React.MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();
      const nextIsOpen = !isStoryOpen;
      setIsStoryOpen(nextIsOpen);

      if (nextIsOpen && !storyResult && artisan && mainImage) {
          setIsStoryLoading(true);
          setStoryError(null);
          try {
              const response = await fetch(`/api/proxy-image?url=${encodeURIComponent(mainImage.imageUrl)}`);
              if (!response.ok) throw new Error('Failed to fetch image for story.');
              const { dataUri } = await response.json();

              const result = await generateArtisanStoryCardAction({ artisan, product, productPhotoDataUri: dataUri });
              if (result.success && result.data) {
                  setStoryResult(result.data);
              } else {
                  throw new Error(result.message || "Story generation failed.");
              }
          } catch (error: any) {
              setStoryError(error.message);
          } finally {
              setIsStoryLoading(false);
          }
      }
  };


  const confirmOrder = async () => {
    if (mainImage && product) {
      setIsBuying(true);
      setIsPaymentDialogOpen(false);
      const item: CartItem = {
        productId: product.id,
        name: product.name,
        price: product.price,
        imageUrl: mainImage.imageUrl,
        quantity: 1,
      };

      try {
        const result = await placeSingleItemOrderAction(item);
        if (result.success && result.orderId) {
          toast({
            title: 'Order Placed!',
            description: 'Your order has been successfully placed.',
          });
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

  return (
    <>
      <Card
        className={`overflow-hidden h-full flex flex-col group transition-all duration-300 hover:shadow-xl hover:-translate-y-1 cursor-pointer ${className}`}
        onClick={handleCardClick}
      >
        <CardHeader className="p-0">
          <div className="relative aspect-square product-image-container">
            {product.badge && (
              <Badge className={`absolute top-2 left-2 z-10 border-none ${badgeColorClasses[product.badge] || 'bg-gray-100 text-gray-800'}`}>
                {product.badge}
              </Badge>
            )}

            {discountPercent > 0 && (
              <Badge variant="destructive" className="absolute top-2 right-2 z-10">
                {discountPercent}% OFF
              </Badge>
            )}

            {mainImage ? (
              <Image
                src={mainImage.imageUrl}
                alt={artisan ? `Photo of ${product.name}, a piece of ${artisan.craft} by ${artisan.name}` : `Photo of ${product.name}`}
                fill
                className={`object-cover transition-opacity duration-300 ${hoverImage ? 'group-hover:opacity-0' : ''}`}
                data-ai-hint={mainImage.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            )}

            {hoverImage && (
              <Image
                src={hoverImage.imageUrl}
                alt={`Alternate view of ${product.name}`}
                fill
                className="object-cover opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                data-ai-hint={hoverImage.imageHint}
              />
            )}
             <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="flex justify-evenly">
                      <Button variant="secondary" size="sm" onClick={handleAddToCart} disabled={isBuying}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Add to Cart
                      </Button>
                       <Button size="sm" onClick={handleBuyNow} disabled={isBuying}>
                          {isBuying ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Buy Now'}
                      </Button>
                  </div>
              </div>
          </div>
        </CardHeader>
        <Collapsible open={isStoryOpen} onOpenChange={setIsStoryOpen}>
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
            
             {artisan && (
                <div className="mt-4">
                  <Button variant="outline" size="sm" onClick={handleToggleStory} className="w-full">
                    {isStoryOpen ? 'Hide Story' : 'Show AI Story'}
                  </Button>
                </div>
            )}


          </CardContent>
          <CollapsibleContent>
             <Separator />
             <div className="p-4 space-y-4">
                 {isStoryLoading && (
                    <div className="flex items-center justify-center text-muted-foreground space-x-2">
                        <Loader2 className="h-5 w-5 animate-spin" />
                        <span>Generating story...</span>
                    </div>
                 )}
                 {storyError && (
                     <div className="flex items-start text-sm text-destructive bg-destructive/10 p-3 rounded-md">
                         <AlertTriangle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                         <p>Error: {storyError}</p>
                     </div>
                 )}
                 {storyResult && (
                    <div className="space-y-3">
                         <p className="text-sm text-foreground/80 italic">"{storyResult.storyCardDescription}"</p>
                        {storyResult.audioDataUri && (
                             <div>
                                 <h4 className="font-semibold mb-1 flex items-center gap-2 text-sm">
                                    <Volume2 className="w-4 h-4"/>
                                    Audio Story
                                </h4>
                                <audio controls src={storyResult.audioDataUri} className="w-full h-10">
                                    Your browser does not support the audio element.
                                </audio>
                            </div>
                        )}
                    </div>
                 )}
             </div>
          </CollapsibleContent>
        </Collapsible>
        <CardFooter className="p-4 pt-0 mt-auto">
           <div className="flex items-baseline gap-2">
             <Badge variant="secondary" className="font-mono text-sm">
                Rs.{product.price}
              </Badge>
              {product.originalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                      Rs.{product.originalPrice}
                  </span>
              )}
          </div>
        </CardFooter>
      </Card>
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onConfirm={confirmOrder}
        total={product.price}
      />
    </>
  );
}

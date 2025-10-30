
'use client';

import { useState, useEffect } from 'react';
import { products, artisans } from '@/lib/data';
import { notFound, useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, User, VenetianMask, Layers, ShoppingCart, ArrowRight, Loader2, ArrowLeft, Star, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import StoryCardModal from '@/components/dashboard/StoryCardModal';
import { useCartStore } from '@/lib/cart-store';
import { useToast } from '@/hooks/use-toast';
import { placeSingleItemOrderAction } from '@/app/actions';
import { useUser } from '@/firebase';
import { customerReviews } from '@/lib/reviews';

export default function ProductPage() {
  const params = useParams();
  const { id } = params;
  const router = useRouter();
  
  const product = products.find((p) => p.id === id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  
  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);
  
  const { addToCart } = useCartStore();
  const { toast } = useToast();
  const { user } = useUser();

  if (!isClient) {
    return null;
  }

  if (!product) {
    notFound();
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);
  const review = customerReviews.find(r => r.id === product.id) ?? customerReviews[0];
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
    }
  };

  const handleBuyNow = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to place an order.',
      });
      router.push('/login');
      return;
    }

    if (image) {
      setIsBuying(true);
      try {
        const result = await placeSingleItemOrderAction({
          productId: product.id,
          name: product.name,
          price: product.price,
          imageUrl: image.imageUrl,
          quantity: 1,
        });

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
    <div className="container mx-auto py-8 md:py-12 px-4">
       <div className="mb-4">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>
      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[300px] sm:min-h-[400px] md:min-h-[500px]">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={`High-quality photo of ${product.name}, a piece of ${artisan?.craft} by ${artisan?.name}`}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            )}
             {discountPercent > 0 && (
              <Badge variant="destructive" className="absolute top-4 left-4 z-10 text-lg">
                {discountPercent}% OFF
              </Badge>
            )}
          </div>
          <div className="p-6 md:p-10 flex flex-col">
            <h1 className="font-headline text-3xl md:text-4xl lg:text-5xl font-bold">
              {product.name}
            </h1>
            
            {artisan && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{artisan.name}</span>
                </div>
                 <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                  <span className="flex items-center gap-2"><VenetianMask className="w-4 h-4" />{artisan.craft}</span>
                  <span className="hidden sm:inline text-muted-foreground/50">|</span>
                   <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{artisan.location}</span>
                </div>
              </div>
            )}

            <Separator className="my-6" />

            <div>
              <h2 className="font-headline text-xl font-semibold mb-2">About the Product</h2>
              <p className="text-foreground/80 leading-relaxed">
                {product.description}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                {product.tags.map((tag) => (
                  <Badge key={tag} variant="outline">{tag}</Badge>
                ))}
              </div>
            </div>

            <Separator className="my-6" />
            
            <div className="bg-muted/50 p-4 rounded-lg">
                <h3 className="font-headline text-lg font-semibold mb-3 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-primary" />
                    What Our Customers Say
                </h3>
                <div className="space-y-2">
                    <div className="flex items-center">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                        ))}
                    </div>
                    <p className="text-foreground/80 italic">"{review.review}"</p>
                    <p className="font-semibold text-sm text-right">- {review.name}</p>
                </div>
            </div>

            <div className="mt-auto pt-8 flex flex-col gap-4">
              <div className="flex items-baseline gap-2">
                <span className="font-headline text-3xl font-bold text-primary">
                  Rs.{product.price}
                </span>
                 {product.originalPrice && (
                  <span className="text-xl text-muted-foreground line-through">
                    Rs.{product.originalPrice}
                  </span>
                )}
              </div>
              <div className="flex flex-col sm:flex-row gap-2 w-full">
                <Button size="lg" onClick={handleBuyNow} className="w-full sm:w-auto" disabled={isBuying}>
                  {isBuying ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2" />}
                  Buy Now
                </Button>
                 <Button size="lg" variant="outline" onClick={handleAddToCart} className="w-full sm:w-auto" disabled={isBuying}>
                  <ShoppingCart className="mr-2" />
                  Add to Cart
                </Button>
              </div>
              <Button size="sm" variant="ghost" onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto justify-start px-0">
                  <Layers className="mr-2" />
                  View AI Story Card
                </Button>
            </div>
          </div>
        </div>
      </Card>
      
      {artisan && (
        <StoryCardModal 
          product={product}
          artisan={artisan}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
        />
      )}
    </div>
  );
}

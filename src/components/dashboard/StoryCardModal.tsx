
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { Product, Artisan } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { generateArtisanStoryCardAction } from '@/app/actions';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Loader2, Volume2, User, VenetianMask, MapPin } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface StoryCardModalProps {
  product: Product;
  artisan: Artisan;
  isOpen: boolean;
  onClose: () => void;
}

export default function StoryCardModal({ product, artisan, isOpen, onClose }: StoryCardModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [storyResult, setStoryResult] = useState<{ storyCardDescription: string; audioQrCode: string } | null>(null);
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  useEffect(() => {
    if (isOpen) {
      const generateStory = async () => {
        setIsLoading(true);

        const imageUrl = image?.imageUrl ?? `https://picsum.photos/seed/${product.id}/600/400`;

        // Fetch the image and convert to data URI
        try {
          const response = await fetch(imageUrl);
          if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.statusText}`);
          }
          const blob = await response.blob();
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = async () => {
            const productPhotoDataUri = reader.result as string;
            
            try {
              const result = await generateArtisanStoryCardAction({
                artisanName: artisan.name,
                craft: artisan.craft,
                location: artisan.location,
                artisanStory: artisan.story,
                productName: product.name,
                productDescription: product.description,
                productPhotoDataUri,
              });
              setStoryResult(result);
            } catch (error) {
              console.error('Error generating story card:', error);
              toast({
                variant: 'destructive',
                title: 'AI Story Generation Failed',
                description: 'Could not generate the artisan story. Please try again later.',
              });
            } finally {
              setIsLoading(false);
            }
          };
           reader.onerror = () => {
            throw new Error('Failed to read image as Data URL');
          };
        } catch (error) {
           console.error('Error fetching or processing image for story generation:', error);
           toast({
            variant: 'destructive',
            title: 'Image Processing Failed',
            description: 'Could not load the product image to generate the story.',
          });
          setIsLoading(false);
        }
      };

      generateStory();
    }
  }, [isOpen, product, artisan, image, toast]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl grid-rows-[auto_1fr_auto] p-0">
        <DialogHeader className="p-6">
          <DialogTitle className="font-headline text-3xl">{product.name}</DialogTitle>
          <DialogDescription className="flex items-center gap-4 pt-1">
             <span className="flex items-center gap-1.5"><User className="w-4 h-4" /> {artisan.name}</span>
             <span className="flex items-center gap-1.5"><VenetianMask className="w-4 h-4" /> {artisan.craft}</span>
             <span className="flex items-center gap-1.5"><MapPin className="w-4 h-4" /> {artisan.location}</span>
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid md:grid-cols-2 gap-6 px-6 pb-6 overflow-y-auto max-h-[70vh]">
          <div className="relative aspect-square">
            {image ? (
                <Image 
                  src={image.imageUrl} 
                  alt={`AI Story card image for ${product.name} by ${artisan.name}`}
                  fill 
                  className="object-cover rounded-md" 
                  data-ai-hint={image.imageHint}
                />
            ) : (
                 <Image 
                  src={`https://picsum.photos/seed/${product.id}/600/400`}
                  alt={`AI Story card image for ${product.name} by ${artisan.name}`}
                  fill 
                  className="object-cover rounded-md" 
                  data-ai-hint="product photo"
                />
            )}
          </div>
          
          <div className="flex flex-col space-y-4">
              <h3 className="font-headline text-xl font-semibold">The Story</h3>
              {isLoading ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground space-y-2">
                    <Loader2 className="w-8 h-8 animate-spin text-primary" />
                    <p>Crafting the artisan's story...</p>
                </div>
              ) : storyResult ? (
                <div className="space-y-4">
                    <p className="text-foreground/80 leading-relaxed italic">
                        "{storyResult.storyCardDescription}"
                    </p>
                    {storyResult.audioQrCode && (
                        <div>
                             <h4 className="font-headline text-lg font-semibold mb-2 flex items-center gap-2">
                                <Volume2 className="w-5 h-5"/>
                                Audio Story
                            </h4>
                            <audio controls src={storyResult.audioQrCode} className="w-full">
                                Your browser does not support the audio element.
                            </audio>
                        </div>
                    )}
                </div>
              ) : (
                 <p className="text-destructive">The story could not be generated.</p>
              )}
             <Separator />
             <div>
                <h3 className="font-headline text-xl font-semibold mb-2">Product Details</h3>
                <p className="text-foreground/80 leading-relaxed">{product.description}</p>
                 <div className="mt-4 flex flex-wrap gap-2">
                    {product.tags.map((tag) => (
                      <Badge key={tag} variant="outline">{tag}</Badge>
                    ))}
                  </div>
             </div>
          </div>
        </div>

        <DialogFooter className="p-6 bg-muted/50 border-t flex items-center justify-between">
           <span className="font-headline text-3xl font-bold text-primary">
              Rs.{product.price}
            </span>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onClose}>Close</Button>
            <Button>Connect with Artisan</Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

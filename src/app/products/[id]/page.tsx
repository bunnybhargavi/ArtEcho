import { products, artisans } from '@/lib/data';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, User, VenetianMask } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = products.find((p) => p.id === params.id);

  if (!product) {
    notFound();
  }

  const artisan = artisans.find((a) => a.id === product.artisanId);
  const image = PlaceHolderImages.find((img) => img.id === product.imageId);

  return (
    <div className="container mx-auto py-12 px-4">
      <Card className="overflow-hidden shadow-lg">
        <div className="grid md:grid-cols-2">
          <div className="relative min-h-[300px] md:min-h-[500px]">
            {image ? (
              <Image
                src={image.imageUrl}
                alt={product.name}
                fill
                className="object-cover"
                data-ai-hint={image.imageHint}
              />
            ) : (
              <div className="w-full h-full bg-muted flex items-center justify-center">
                <span className="text-muted-foreground text-sm">No Image</span>
              </div>
            )}
          </div>
          <div className="p-6 md:p-10 flex flex-col">
            <h1 className="font-headline text-3xl md:text-5xl font-bold">
              {product.name}
            </h1>
            
            {artisan && (
              <div className="mt-4">
                <div className="flex items-center gap-2 text-lg font-medium">
                  <User className="w-5 h-5 text-muted-foreground" />
                  <span>{artisan.name}</span>
                </div>
                 <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <VenetianMask className="w-4 h-4" />
                  <span>{artisan.craft}</span>
                  <span className="text-muted-foreground/50">|</span>
                   <MapPin className="w-4 h-4" />
                  <span>{artisan.location}</span>
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

            {artisan && (
              <div className="mt-6">
                 <h2 className="font-headline text-xl font-semibold mb-2">The Artisan's Story</h2>
                 <p className="text-foreground/80 leading-relaxed italic">
                  "{artisan.story}"
                 </p>
              </div>
            )}
            
            <div className="mt-auto pt-8 flex items-center justify-between">
              <span className="font-headline text-3xl font-bold text-primary">
                ${product.price.toFixed(2)}
              </span>
              <Button size="lg">Connect with Artisan</Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

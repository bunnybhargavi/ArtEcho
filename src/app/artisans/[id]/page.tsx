
'use client';

import { useState } from 'react';
import { useParams, notFound } from 'next/navigation';
import Image from 'next/image';
import { artisans, products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, User, VenetianMask, Mail } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product, Artisan } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ArtisanPage() {
  const params = useParams();
  const { id } = params;

  const artisan = artisans.find((a) => a.id === id);
  const artisanProducts = products.filter((p) => p.artisanId === id);

  const [selectedProduct, setSelectedProduct] = useState<{ product: Product, artisan?: Artisan } | null>(null);

  if (!artisan) {
    notFound();
  }

  const handleProductClick = (product: Product, artisan?: Artisan) => {
    setSelectedProduct({ product, artisan });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  
  const artisanImage = PlaceHolderImages.find(p => p.id.includes(artisan.id));


  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <Card className="overflow-hidden shadow-lg">
        <div className="relative h-48 md:h-64 bg-muted">
            <Image 
                src={`https://picsum.photos/seed/${artisan.id}b/1200/400`} 
                alt={`${artisan.name}'s workshop`}
                fill
                className="object-cover"
                data-ai-hint="artisan workshop"
            />
            <div className="absolute inset-0 bg-black/30" />
        </div>
        <CardContent className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 z-10 relative">
            <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-card shadow-md shrink-0">
               <Image
                src={artisanImage?.imageUrl ?? `https://picsum.photos/seed/${artisan.id}/160/160`}
                alt={artisan.name}
                fill
                className="rounded-full object-cover"
                data-ai-hint="portrait person"
              />
            </div>
            <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
              <h1 className="font-headline text-3xl md:text-4xl font-bold">{artisan.name}</h1>
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                <span className="flex items-center gap-2"><VenetianMask className="w-4 h-4" />{artisan.craft}</span>
                <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{artisan.location}</span>
              </div>
              <div className="mt-4 flex items-center gap-2">
                 <Button>
                    <Mail className="mr-2" />
                    Connect
                </Button>
                <Button variant="outline">Follow</Button>
              </div>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t">
             <h2 className="font-headline text-xl font-semibold mb-2">Our Story</h2>
             <p className="text-foreground/80 leading-relaxed italic max-w-3xl">
                "{artisan.story}"
            </p>
          </div>
        </CardContent>
      </Card>
      
      <div>
        <h2 className="font-headline text-3xl font-bold mb-8 text-center">{`Creations by ${artisan.name}`}</h2>
        {artisanProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {artisanProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                artisan={artisan}
                onImageClick={handleProductClick}
              />
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">No products found for this artisan yet.</p>
        )}
      </div>

       {selectedProduct && selectedProduct.artisan && (
        <QuickViewModal
          product={selectedProduct.product}
          artisan={selectedProduct.artisan}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

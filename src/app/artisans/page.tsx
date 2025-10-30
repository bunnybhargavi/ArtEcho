
'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { artisans, products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { MapPin, VenetianMask } from 'lucide-react';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product, Artisan } from '@/lib/types';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function ArtisansPage() {
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product; artisan?: Artisan } | null>(null);

  const handleProductClick = (product: Product, artisan?: Artisan) => {
    setSelectedProduct({ product, artisan });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Meet Our Artisans</h1>
        <p className="text-muted-foreground text-lg mt-2">
          Discover the talented creators behind our unique collection of handcrafted goods.
        </p>
      </div>

      <div className="space-y-16">
        {artisans.map((artisan, index) => {
          const artisanProducts = products.filter((p) => p.artisanId === artisan.id);
          const artisanImage = PlaceHolderImages.find((p) => p.id.includes(artisan.id));

          return (
            <section key={artisan.id}>
              <Card className="overflow-hidden shadow-lg border">
                <div className="relative h-40 md:h-56 bg-muted">
                  <Image
                    src={`https://picsum.photos/seed/${artisan.id}b/1200/400`}
                    alt={`${artisan.name}'s workshop, a creative space for ${artisan.craft}`}
                    fill
                    className="object-cover"
                    data-ai-hint="artisan workshop"
                  />
                  <div className="absolute inset-0 bg-black/30" />
                </div>
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row items-center md:items-end gap-6 -mt-16 md:-mt-20 z-10 relative">
                    <div className="relative h-32 w-32 md:h-40 md:w-40 rounded-full border-4 border-card shadow-md shrink-0">
                      <Image
                        src={artisanImage?.imageUrl ?? `https://picsum.photos/seed/${artisan.id}/160/160`}
                        alt={`Portrait of ${artisan.name}, a master of ${artisan.craft}`}
                        fill
                        className="rounded-full object-cover"
                        data-ai-hint="portrait person"
                      />
                    </div>
                    <div className="flex flex-col items-center md:items-start text-center md:text-left w-full">
                      <h2 className="font-headline text-3xl md:text-4xl font-bold">{artisan.name}</h2>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-sm text-muted-foreground mt-1">
                        <span className="flex items-center gap-2"><VenetianMask className="w-4 h-4" />{artisan.craft}</span>
                        <span className="flex items-center gap-2"><MapPin className="w-4 h-4" />{artisan.location}</span>
                      </div>
                      <p className="text-foreground/80 leading-relaxed italic max-w-2xl mt-4 line-clamp-2">
                        "{artisan.story}"
                      </p>
                       <Button asChild className="mt-4">
                          <Link href={`/artisans/${artisan.id}`}>View Full Profile</Link>
                       </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-8">
                <h3 className="font-headline text-2xl font-bold mb-6">Creations by {artisan.name}</h3>
                {artisanProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {artisanProducts.slice(0, 4).map((product) => (
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
              
              {index < artisans.length - 1 && <Separator className="mt-16" />}
            </section>
          );
        })}
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

'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { products, artisans } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { motion } from 'framer-motion';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product, Artisan } from '@/lib/types';
import Footer from '@/components/Footer';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product, artisan?: Artisan } | null>(null);

  const handleProductClick = (product: Product, artisan?: Artisan) => {
    setSelectedProduct({ product, artisan });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] md:h-[80vh] text-white">
        {heroImage && (
          <Image
            src={heroImage.imageUrl}
            alt={heroImage.description}
            fill
            className="object-cover"
            priority
            data-ai-hint={heroImage.imageHint}
          />
        )}
        <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center text-center p-4">
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <h1 className="font-headline text-4xl sm:text-5xl md:text-7xl font-bold tracking-tight">
             Discover Unique Artisan Creations
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-md sm:text-lg md:text-xl">
              One-of-a-kind pieces made with love.
            </p>
            <Link href="/#featured-creations">
              <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90">
                Explore Artisan Crafts
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      <section id="featured-creations" className="w-full py-12 md:py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Creations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-8">
            {products.slice(0, 4).map((product) => {
              const artisan = artisans.find(
                (art) => art.id === product.artisanId
              );
              return (
                <ProductCard
                  key={product.id}
                  product={product}
                  artisan={artisan}
                  onImageClick={handleProductClick}
                  className="[&:nth-child(n+5)]:hidden lg:[&:nth-child(n+5)]:block"
                />
              );
            })}
          </div>
           <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link href="/products">View All Creations</Link>
              </Button>
           </div>
        </div>
      </section>

      {selectedProduct && selectedProduct.artisan && (
        <QuickViewModal
          product={selectedProduct.product}
          artisan={selectedProduct.artisan}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
      <Footer />
    </div>
  );
}


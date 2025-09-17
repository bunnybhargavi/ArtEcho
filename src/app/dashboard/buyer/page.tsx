
'use client';

import { useState } from 'react';
import { products, artisans } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import StoryCardModal from '@/components/dashboard/StoryCardModal';
import type { Product, Artisan } from '@/lib/types';

export default function BuyerDashboardPage() {
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product, artisan?: Artisan } | null>(null);

  const handleProductClick = (product: Product, artisan?: Artisan) => {
    setSelectedProduct({ product, artisan });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          Virtual Exhibition
        </h1>
        <p className="text-muted-foreground text-lg mt-2">
          Discover the stories behind each unique creation.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const artisan = artisans.find(
            (art) => art.id === product.artisanId
          );
          return (
            <div
              key={product.id}
              onClick={() => handleProductClick(product, artisan)}
              className="cursor-pointer"
            >
              <ProductCard product={product} artisan={artisan} />
            </div>
          );
        })}
      </div>

      {selectedProduct && selectedProduct.artisan && (
        <StoryCardModal
          product={selectedProduct.product}
          artisan={selectedProduct.artisan}
          isOpen={!!selectedProduct}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
}

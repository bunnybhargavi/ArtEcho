
'use client';

import { useState } from 'react';
import { products, artisans } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product, Artisan } from '@/lib/types';

export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product, artisan?: Artisan } | null>(null);

  const handleProductClick = (product: Product, artisan?: Artisan) => {
    setSelectedProduct({ product, artisan });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="font-headline text-4xl md:text-5xl font-bold mb-12 text-center">
        All Creations
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.map((product) => {
          const artisan = artisans.find(
            (art) => art.id === product.artisanId
          );
          return (
            <ProductCard
              key={product.id}
              product={product}
              artisan={artisan}
              onImageClick={handleProductClick}
            />
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

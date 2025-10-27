
'use client';

import { useState, useMemo } from 'react';
import { products, artisans } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import QuickViewModal from '@/components/QuickViewModal';
import type { Product, Artisan } from '@/lib/types';
import ProductFilters from '@/components/ProductFilters';
import { useSearchParams } from 'next/navigation';
import { Separator } from '@/components/ui/separator';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('q') || '';
  
  const [selectedProduct, setSelectedProduct] = useState<{ product: Product, artisan?: Artisan } | null>(null);
  const [searchTerm, setSearchTerm] = useState(initialSearch);

  const handleProductClick = (product: Product, artisan?: Artisan) => {
    setSelectedProduct({ product, artisan });
  };

  const handleCloseModal = () => {
    setSelectedProduct(null);
  };
  
  const filteredProducts = useMemo(() => {
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [searchTerm]);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">
          All Creations
        </h1>
         <p className="text-muted-foreground text-lg mt-2">
          Explore our collection of handcrafted goods from artisans around the world.
        </p>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-8">
        <aside className="hidden lg:block">
            <ProductFilters />
        </aside>

        <main>
           {/* Mobile filters could go here in an Accordion/Sheet */}
           <div className="lg:hidden mb-6">
              <ProductFilters />
           </div>
           
           <Separator className="mb-8" />
           
          {filteredProducts.length > 0 ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {filteredProducts.map((product) => {
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
          ) : (
             <div className="flex flex-col items-center justify-center text-center text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[400px]">
                <h2 className="text-xl font-semibold">No Products Found</h2>
                <p className="mt-2">Try adjusting your search or filters to find what you're looking for.</p>
             </div>
          )}
        </main>
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

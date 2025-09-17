import { products, artisans } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';

export default function ProductsPage() {
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
            />
          );
        })}
      </div>
    </div>
  );
}

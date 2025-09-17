import Image from 'next/image';
import Link from 'next/link';
import { products, artisans } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';
import { Button } from '@/components/ui/button';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function Home() {
  const heroImage = PlaceHolderImages.find((img) => img.id === 'hero');

  return (
    <div className="flex flex-col">
      <section className="relative w-full h-[60vh] text-white">
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
          <h1 className="font-headline text-5xl md:text-7xl font-bold tracking-tight">
            ArtEcho
          </h1>
          <p className="mt-4 max-w-2xl text-lg md:text-xl">
            Discover the story behind every creation.
          </p>
          <Link href="/#featured-creations">
            <Button size="lg" className="mt-8 bg-primary hover:bg-primary/90">
              Explore Artisan Crafts
            </Button>
          </Link>
        </div>
      </section>

      <section id="featured-creations" className="w-full py-12 md:py-24 scroll-mt-20">
        <div className="container mx-auto px-4">
          <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">
            Featured Creations
          </h2>
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
      </section>
    </div>
  );
}

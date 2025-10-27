import AIBrandMatcher from "@/components/dashboard/AIBrandMatcher";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { artisans } from "@/lib/data";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Link from "next/link";


export default function BrandDashboardPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-12">
      <div>
        <h1 className="font-headline text-4xl md:text-5xl font-bold mb-2">Brand Dashboard</h1>
        <p className="text-muted-foreground text-lg">Connect with artisans and discover unique products that align with your brand.</p>
      </div>

      <AIBrandMatcher />

      <Card>
        <CardHeader>
          <CardTitle>Meet the Artisans</CardTitle>
          <CardDescription>
            Browse our talented artisans and connect with them directly.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent>
              {artisans.map((artisan) => {
                const artisanImage = PlaceHolderImages.find(p => p.id.includes(artisan.id));
                return (
                  <CarouselItem key={artisan.id} className="md:basis-1/2 lg:basis-1/3">
                    <div className="p-1">
                      <Card className="overflow-hidden">
                        <CardContent className="flex flex-col items-center justify-center p-6 space-y-4">
                          <div className="relative h-24 w-24">
                             <Image
                              src={artisanImage?.imageUrl ?? `https://picsum.photos/seed/${artisan.id}/100/100`}
                              alt={artisan.name}
                              fill
                              className="rounded-full object-cover"
                              data-ai-hint="portrait person"
                            />
                          </div>
                          <div className="text-center">
                            <h3 className="font-headline text-xl font-semibold">{artisan.name}</h3>
                            <p className="text-sm text-muted-foreground">{artisan.craft}</p>
                            <p className="text-sm text-muted-foreground">{artisan.location}</p>
                          </div>
                          <p className="text-sm text-center text-foreground/80 italic line-clamp-3">
                            "{artisan.story}"
                          </p>
                          <Button asChild>
                            <Link href={`/artisans/${artisan.id}`}>View Profile</Link>
                          </Button>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                )
              })}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Product Catalog</CardTitle>
          <CardDescription>
            Download our full product catalog to explore all available creations.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button>
            <Download className="mr-2" />
            Download Catalog (PDF)
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}

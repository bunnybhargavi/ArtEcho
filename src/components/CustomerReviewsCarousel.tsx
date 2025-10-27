
'use client';

import React, { useCallback, useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { Card, CardContent } from '@/components/ui/card';
import { customerReviews } from '@/lib/reviews';
import { Star } from 'lucide-react';

export function CustomerReviewsCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: 'start' },
    [Autoplay({ delay: 4000, stopOnInteraction: false, playOnInit: true })]
  );

  return (
    <div className="overflow-hidden" ref={emblaRef}>
      <div className="flex">
        {customerReviews.map((review) => (
          <div key={review.id} className="flex-grow-0 flex-shrink-0 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4 xl:basis-1/5 p-2">
            <Card className="h-full flex flex-col">
              <CardContent className="p-6 flex flex-col items-center text-center flex-grow">
                <div className="flex items-center mb-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-5 h-5 ${
                        i < review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-sm text-foreground/80 italic mb-4 flex-grow">
                  "{review.review}"
                </p>
                <p className="font-semibold text-sm text-primary">{review.name}</p>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
}

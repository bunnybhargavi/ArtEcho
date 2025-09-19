
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { matchArtisansToBrandAction } from '@/app/actions';
import { artisans, products } from '@/lib/data';
import { ProductCard } from '@/components/ProductCard';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Wand2 } from 'lucide-react';
import type { MatchArtisansToBrandOutput } from '@/ai/flows/match-artisans-to-brand-flow';

const formSchema = z.object({
  brandStyle: z.string().min(3, 'Brand style must be at least 3 characters.'),
  marketTrends: z.string().min(3, 'Market trends must be at least 3 characters.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AIBrandMatcher() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<MatchArtisansToBrandOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brandStyle: '',
      marketTrends: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    try {
      const response = await matchArtisansToBrandAction(values);
      setResult(response);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error Finding Matches',
        description: 'There was a problem with the AI matchmaking. Please try again.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start">
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wand2 className="text-primary" />
            AI Artisan Matchmaker
          </CardTitle>
          <CardDescription>
            Describe your brand and desired trends to find the perfect artisan partners.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
              <FormField
                control={form.control}
                name="brandStyle"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Your Brand's Style</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Minimalist, Sustainable, Luxury" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="marketTrends"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Relevant Market Trends</FormLabel>
                    <FormControl>
                      <Textarea placeholder="e.g., Earth tones, natural materials, bold geometric patterns" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? (
                  <Loader2 className="mr-2 animate-spin" />
                ) : (
                  <Sparkles className="mr-2" />
                )}
                Find Matches
              </Button>
            </CardContent>
          </form>
        </Form>
      </Card>

      <div className="lg:col-span-2">
         <h2 className="font-headline text-2xl md:text-3xl font-bold mb-4">Recommended For You</h2>
        {isLoading && (
            <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[400px]">
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
                <p>Analyzing trends and finding matches...</p>
            </div>
        )}
        {!isLoading && !result && (
            <div className="flex items-center justify-center text-center text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[400px]">
                <p>Your AI-powered recommendations will appear here.</p>
            </div>
        )}
        {result && (
          <div className="space-y-6">
            {result.recommendations.map((rec, index) => {
              const product = products.find(p => p.id === rec.productId);
              const artisan = artisans.find(a => a.id === rec.artisanId);
              if (!artisan) return null;

              return (
                <Card key={index} className="overflow-hidden">
                    <div className="grid md:grid-cols-3 items-stretch">
                        <div className="md:col-span-2 p-6 flex flex-col">
                            <h3 className="font-headline text-lg md:text-xl font-semibold mb-2">Recommendation</h3>
                            <p className="text-foreground/80 leading-relaxed italic">"{rec.reason}"</p>
                        </div>
                         {product && (
                            <div className="p-4 bg-muted/50 h-full border-t md:border-t-0 md:border-l">
                                <ProductCard product={product} artisan={artisan} />
                            </div>
                        )}
                        {!product && artisan && (
                            <div className="p-4 bg-muted/50 h-full flex items-center justify-center text-center border-t md:border-t-0 md:border-l">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">Featured Artisan</h4>
                                    <p className="font-headline text-lg">{artisan.name}</p>
                                    <p className="text-sm text-muted-foreground">{artisan.craft}</p>
                                </div>
                            </div>
                        )}
                    </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  );
}

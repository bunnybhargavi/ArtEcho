'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateArtisanStoryCardAction } from '@/app/actions';
import { artisans, products } from '@/lib/data';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Volume2 } from 'lucide-react';
import type { GenerateArtisanStoryCardOutput } from '@/ai/flows/generate-artisan-story-card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const formSchema = z.object({
  artisanId: z.string().min(1, 'Artisan is required.'),
  productId: z.string().min(1, 'Product is required.'),
  productPhoto: z.any().refine((files) => files?.length === 1, 'Product photo is required.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function AIStoryGenerator() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<GenerateArtisanStoryCardOutput | null>(null);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      artisanId: '',
      productId: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    const artisan = artisans.find(a => a.id === values.artisanId);
    const product = products.find(p => p.id === values.productId);

    if (!artisan || !product) {
        toast({ variant: 'destructive', title: 'Error', description: 'Selected artisan or product not found.'});
        setIsLoading(false);
        return;
    }

    const file = values.productPhoto[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const productPhotoDataUri = reader.result as string;
      try {
        const response = await generateArtisanStoryCardAction({
          artisanId: values.artisanId,
          productId: values.productId,
          artisanName: artisan.name,
          craft: artisan.craft,
          location: artisan.location,
          artisanStory: artisan.story,
          productName: product.name,
          productDescription: product.description,
          productPhotoDataUri,
        });
        setResult(response);
        toast({
          title: "Story Card Generated!",
          description: "Your new story card has been created.",
        });
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Story',
          description: 'There was a problem generating the story card. Please try again.',
        });
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    
    reader.onerror = () => {
        toast({
            variant: 'destructive',
            title: 'Error Reading File',
            description: 'Could not read the selected image file.',
        });
        setIsLoading(false);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-8 items-start">
      <Card>
        <CardHeader>
          <CardTitle>Generate Story Card</CardTitle>
          <CardDescription>
            Fill in the details below, and our AI will craft a beautiful story card for your product.
          </CardDescription>
        </CardHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <CardContent className="space-y-4">
               <FormField
                  control={form.control}
                  name="artisanId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Artisan</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select an artisan" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {artisans.map(artisan => (
                            <SelectItem key={artisan.id} value={artisan.id}>{artisan.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              <FormField
                control={form.control}
                name="productId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value} disabled={!form.watch('artisanId')}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a product" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {products.filter(p => p.artisanId === form.watch('artisanId')).map(product => (
                            <SelectItem key={product.id} value={product.id}>{product.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productPhoto"
                render={({ field: { onChange, value, ...rest } }) => (
                  <FormItem>
                    <FormLabel>Product Photo</FormLabel>
                    <FormControl>
                       <Input type="file" accept="image/*" onChange={(e) => onChange(e.target.files)} {...rest} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </CardContent>
            <CardFooter>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="mr-2 h-4 w-4" />
                )}
                Generate Story
              </Button>
            </CardFooter>
          </form>
        </Form>
      </Card>

      <Card className="flex flex-col min-h-[400px]">
        <CardHeader>
          <CardTitle>Generated Story Card</CardTitle>
          <CardDescription>
            Your AI-generated story and audio will appear here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow flex items-center justify-center">
          {isLoading && (
            <div className="flex flex-col items-center gap-4 text-muted-foreground">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
              <p>Generating your story...</p>
            </div>
          )}
          {!isLoading && !result && (
            <div className="text-center text-muted-foreground p-8">
              <p>Your result will be displayed here.</p>
            </div>
          )}
          {result && (
            <div className="space-y-6 w-full">
              <div>
                <h3 className="font-headline text-xl font-semibold mb-2">Story Description</h3>
                <p className="text-foreground/80 leading-relaxed italic">
                  "{result.storyCardDescription}"
                </p>
              </div>
              <div>
                <h3 className="font-headline text-xl font-semibold mb-2 flex items-center gap-2">
                  <Volume2 className="w-5 h-5"/>
                  Audio Story
                </h3>
                {result.audioDataUri ? (
                  <audio controls src={result.audioDataUri} className="w-full">
                    Your browser does not support the audio element.
                  </audio>
                ) : (
                  <p className="text-muted-foreground">Audio could not be generated.</p>
                )}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

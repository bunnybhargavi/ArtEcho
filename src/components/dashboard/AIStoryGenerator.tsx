'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { generateArtisanStoryCardAction } from '@/app/actions';

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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Sparkles, Volume2 } from 'lucide-react';
import type { GenerateArtisanStoryCardOutput } from '@/ai/flows/generate-artisan-story-card';

const formSchema = z.object({
  artisanName: z.string().min(2, 'Artisan name is required.'),
  craft: z.string().min(2, 'Craft type is required.'),
  location: z.string().min(2, 'Location is required.'),
  artisanStory: z.string().min(10, 'Artisan story must be at least 10 characters.'),
  productName: z.string().min(2, 'Product name is required.'),
  productDescription: z.string().min(10, 'Product description must be at least 10 characters.'),
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
      artisanName: '',
      craft: '',
      location: '',
      artisanStory: '',
      productName: '',
      productDescription: '',
    },
  });

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true);
    setResult(null);

    const file = values.productPhoto[0];
    const reader = new FileReader();

    reader.onloadend = async () => {
      const productPhotoDataUri = reader.result as string;
      try {
        const response = await generateArtisanStoryCardAction({
          ...values,
          productPhotoDataUri,
        });
        setResult(response);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error Generating Story',
          description: 'There was a problem with the AI generation. Please try again.',
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
                name="artisanName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artisan Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Elena Rodriguez" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="craft"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Craft</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Ceramics" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Oaxaca, Mexico" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="artisanStory"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Artisan Story</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell your personal story..." {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Name</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Terra Cotta Mug" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="productDescription"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Product Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Describe your product..." {...field} />
                    </FormControl>
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

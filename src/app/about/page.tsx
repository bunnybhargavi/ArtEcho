
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CustomerReviewsCarousel } from '@/components/CustomerReviewsCarousel';

const qAndA = [
  {
    question: "What makes ArtEcho products unique?",
    answer: "Each item on ArtEcho is handcrafted by a skilled artisan. We focus on authentic craftsmanship, meaning every product has a story and is made with traditional techniques and high-quality materials, unlike mass-produced goods."
  },
  {
    question: "How does ArtEcho support local artisans?",
    answer: "Our platform provides artisans with AI-powered tools to create marketing materials, tell their stories, and connect with a global market. We handle the technology so they can focus on their craft, ensuring they receive fair compensation and recognition for their work."
  },
  {
    question: "Are the materials sustainable?",
    answer: "Many of our artisans prioritize sustainability, using locally sourced, natural, and recycled materials. You can often find details about the materials and processes in the product descriptions and the artisan's story."
  },
  {
    question: "How do I care for my handmade product?",
    answer: "Care instructions vary by product and material. We include specific care guidelines on each product page to help you preserve the beauty and longevity of your unique item."
  }
];

export default function AboutPage() {
  return (
    <div className="container mx-auto py-12 px-4 space-y-16">
      <section className="text-center">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">About ArtEcho</h1>
        <p className="mt-4 max-w-3xl mx-auto text-lg text-muted-foreground">
          We are a passionate team dedicated to bridging the gap between traditional craftsmanship and the modern world. ArtEcho was born from a desire to give a global voice to local artisans, celebrating the stories, cultures, and skills woven into every handmade product.
        </p>
      </section>

      <section>
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-8">Our Mission</h2>
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <div className="prose prose-lg text-foreground/80 max-w-none">
            <p>
              In a world of mass production, the soul of craftsmanship is often lost. We believe that the most beautiful products are not just objects, but are extensions of a story, a tradition, and a person. Our mission is to empower artisans by providing them with a platform to share their creations and their narratives with a global audience that values authenticity and quality.
            </p>
            <p>
              By leveraging cutting-edge AI, we help artisans create compelling marketing content and connect with brands and buyers who are looking for something truly special. We are committed to fostering a community where art, culture, and commerce can thrive together, creating a more sustainable and meaningful marketplace for all.
            </p>
          </div>
          <div className="relative h-64 md:h-96 rounded-lg overflow-hidden shadow-lg">
             <img src="https://images.unsplash.com/photo-1528461231221-3b567504a5ac?q=80&w=2070&auto=format&fit=crop" alt="Artisan working" className="w-full h-full object-cover"/>
             <div className="absolute inset-0 bg-black/20"></div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">Customer Q&A</h2>
        <Card>
          <CardContent className="p-6">
            <Accordion type="single" collapsible className="w-full">
              {qAndA.map((item, index) => (
                <AccordionItem value={`item-${index}`} key={index}>
                  <AccordionTrigger className="text-lg font-semibold text-left">{item.question}</AccordionTrigger>
                  <AccordionContent className="text-base text-muted-foreground pt-2">
                    {item.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </section>
      
      <section className="w-full">
         <h2 className="font-headline text-3xl md:text-4xl font-bold text-center mb-12">What Our Customers Say</h2>
         <CustomerReviewsCarousel />
      </section>
    </div>
  );
}

    
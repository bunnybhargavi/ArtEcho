
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import type { Order, TrackingEvent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Home, ChevronDown, ChevronUp } from 'lucide-react';
import Image from 'next/image';
import { useUser } from '@/lib/auth-store';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import TrackingProgressBar from '@/components/TrackingProgressBar';


const allStatuses = ['Placed', 'Shipped', 'On the way', 'Out for delivery', 'Delivered'] as const;

// This is a fake order generator for the mock system.
const generateFakeOrder = (orderId: string): Order => {
    const trackingHistory: TrackingEvent[] = [
        { status: 'Package has left seller facility and is in transit to carrier', location: 'Sumner WA US', timestamp: '2015-06-08T14:00:00Z' },
        { status: 'Package arrived at a carrier facility', location: 'Seattle WA US', timestamp: '2015-06-08T14:35:00Z' },
        { status: 'Out for delivery', location: 'Seattle WA US', timestamp: '2015-06-08T15:24:00Z' },
        { status: 'Out for delivery', location: 'Seattle WA US', timestamp: '2015-06-08T16:07:00Z' },
    ];

    return {
        id: orderId,
        userId: 'fake-user-id',
        items: [
            {
                productId: '1',
                name: 'Terracotta Chai Cup Set',
                price: 350,
                imageUrl: 'https://cdn.vibecity.in/providers/63e609ba1095ba0012311f77/064d500a-705c-4aa3-ab67-446ebc5a5c8a_f5962e3a-6cbd-4588-8f94-6cddae2fe48a-3X.png',
                quantity: 2,
            }
        ],
        total: 700,
        status: 'Out for delivery',
        createdAt: '2015-06-07T10:00:00Z',
        expectedDelivery: '2015-06-08T20:00:00Z',
        statusHistory: trackingHistory,
    };
};


export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { user, isUserLoading } = useUser();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isUserLoading) {
      if (user) {
        // In a real app, you'd fetch this from Firestore.
        // Here, we generate a fake order.
        setOrder(generateFakeOrder(orderId));
        setIsLoading(false);
      } else {
        // If no user, we can't show the order.
        router.push('/login');
      }
    }
  }, [isUserLoading, user, orderId, router]);


  if (isLoading || isUserLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg font-semibold">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return notFound();
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl md:text-4xl font-headline">Shipment Tracking</CardTitle>
           <div className="mb-4">
                <Button variant="ghost" onClick={() => router.back()} className="px-0 hover:bg-transparent">
                  <ArrowLeft className="mr-2" />
                  Back
                </Button>
            </div>
        </CardHeader>
        <CardContent className="space-y-8">
            {/* Main Status */}
            <div className="pb-8 border-b">
                 <div className="flex justify-between items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-primary">{order.status}</h2>
                        {order.expectedDelivery && 
                            <p className="text-green-600 font-semibold">Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}, by 8:00pm</p>
                        }
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                        <p>Your package is out for delivery and will arrive today.</p>
                        <p>(Updated 0 minute(s) ago)</p>
                    </div>
                </div>

                <TrackingProgressBar currentStatus={order.status} statuses={allStatuses} />
            </div>

          {/* Tracking Details Accordion */}
          <Accordion type="single" collapsible defaultValue='item-1'>
            <AccordionItem value="item-1">
              <AccordionTrigger className="text-xl font-semibold">
                Tracking Details
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 pt-4">
                  {order.statusHistory?.map((event, index) => (
                    <div key={index} className="grid grid-cols-[1fr_2fr] sm:grid-cols-[1fr_1fr_2fr] gap-4 text-sm">
                      <div className="font-medium">
                        {new Date(event.timestamp).toLocaleString('en-US', { 
                            weekday: 'long', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric', hour12: true 
                        })}
                        <br/>
                        <span className="text-muted-foreground">{event.location}</span>
                      </div>
                      <div className="sm:col-start-3">{event.status}</div>
                    </div>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>

        </CardContent>
        <CardFooter className="flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">Questions about your order? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>.</p>
            <Button asChild>
                <Link href="/products"><Home className="mr-2"/>Continue Shopping</Link>
            </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

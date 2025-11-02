
'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import type { Order, TrackingEvent } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, ArrowLeft, Home, Package } from 'lucide-react';
import Image from 'next/image';
import { useUser, useFirebase } from '@/firebase';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import TrackingProgressBar from '@/components/TrackingProgressBar';
import { useDoc, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Separator } from '@/components/ui/separator';


const allStatuses = ['Placed', 'Shipped', 'On the way', 'Out for delivery', 'Delivered'] as const;

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { user, isUserLoading } = useUser();
  const { firestore } = useFirebase();

  const orderDocRef = useMemoFirebase(
    () => (user && firestore && orderId ? doc(firestore, 'users', user.uid, 'orders', orderId) : null),
    [user, firestore, orderId]
  );

  const { data: order, isLoading: isOrderLoading, error } = useDoc<Order>(orderDocRef);

  if (isOrderLoading || isUserLoading) {
    return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-4 text-muted-foreground">
          <Loader2 className="w-12 h-12 animate-spin text-primary" />
          <p className="text-lg font-semibold">Loading your order details...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // This should ideally not be hit if routing is protected, but as a fallback:
    router.push('/login');
    return null;
  }
  
  if (!order) {
    // This can mean the order doesn't exist or there was an error (which `useDoc` would also capture)
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
                            <p className="text-green-600 font-semibold">Expected delivery: {new Date(order.expectedDelivery).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
                        }
                    </div>
                    <div className="text-right text-sm text-muted-foreground">
                        <p>Order ID: <span className="font-mono">{order.id}</span></p>
                        <p>Placed on: {new Date(order.createdAt).toLocaleDateString()}</p>
                    </div>
                </div>

                <TrackingProgressBar currentStatus={order.status} statuses={allStatuses} />
            </div>
            
            {/* Order Items */}
            <Accordion type="single" collapsible defaultValue='item-1'>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-semibold">
                        Order Summary
                    </AccordionTrigger>
                    <AccordionContent className="pt-4">
                        <div className="space-y-4">
                            {order.items.map(item => (
                                <div key={item.productId} className="flex gap-4 items-center">
                                    <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0">
                                        <Image src={item.imageUrl} alt={item.name} fill className="object-cover" />
                                    </div>
                                    <div className="flex-grow">
                                        <p className="font-semibold">{item.name}</p>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <p className="font-medium">Rs.{item.price * item.quantity}</p>
                                </div>
                            ))}
                        </div>
                        <Separator className="my-4"/>
                        <div className="text-right font-bold text-lg">
                            Total: Rs.{order.total}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>


          {/* Tracking Details Accordion */}
          <Accordion type="single" collapsible>
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

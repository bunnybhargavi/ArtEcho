'use client';

import { useParams, notFound, useRouter } from 'next/navigation';
import { useDoc, useMemoFirebase } from '@/firebase';
import type { Order } from '@/lib/types';
import { doc } from 'firebase/firestore';
import { useFirebase } from '@/firebase';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Loader2, Package, CheckCircle, Truck, Home, ArrowLeft } from 'lucide-react';
import Image from 'next/image';

const statusConfig = {
  Placed: { icon: Package, text: 'Order Placed', color: 'text-blue-500' },
  Shipped: { icon: Truck, text: 'Order Shipped', color: 'text-yellow-500' },
  Delivered: { icon: CheckCircle, text: 'Order Delivered', color: 'text-green-500' },
  Cancelled: { icon: CheckCircle, text: 'Order Cancelled', color: 'text-red-500' },
};

export default function TrackingPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params.orderId as string;
  const { firestore, user, isUserLoading } = useFirebase();

  const orderRef = useMemoFirebase(() => {
    if (!firestore || !user || !orderId) return null;
    return doc(firestore, 'users', user.uid, 'orders', orderId);
  }, [firestore, user, orderId]);

  const { data: order, isLoading, error } = useDoc<Order>(orderRef);

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

  if (error) {
     return (
      <div className="container mx-auto py-12 px-4 flex justify-center items-center min-h-[60vh]">
        <p className="text-destructive">Error loading order: {error.message}</p>
      </div>
    );
  }

  if (!order) {
    return notFound();
  }

  const currentStatus = statusConfig[order.status];

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="mb-8">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2" />
          Back
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl md:text-3xl font-headline">Order Tracking</CardTitle>
          <CardDescription>Order ID: {order.id}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-lg bg-muted">
            <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Status</p>
              <div className={`flex items-center gap-2 text-xl font-bold ${currentStatus.color}`}>
                <currentStatus.icon className="w-6 h-6" />
                <span>{currentStatus.text}</span>
              </div>
            </div>
             <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Order Date</p>
              <p className="font-semibold">{new Date(order.createdAt).toLocaleDateString()}</p>
            </div>
             <div className="text-center sm:text-left">
              <p className="text-sm text-muted-foreground">Total Amount</p>
              <p className="font-semibold">Rs.{order.total}</p>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold mb-4">Items in your order</h3>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4 p-4 border rounded-md">
                   <div className="relative h-16 w-16 rounded-md overflow-hidden shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                  <div className="flex-grow">
                    <p className="font-semibold">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Quantity: {item.quantity}
                    </p>
                  </div>
                  <div className="font-semibold">
                    <span>Rs.{item.price * item.quantity}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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

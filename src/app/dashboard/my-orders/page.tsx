
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { useUser } from '@/lib/auth-store';
import type { Order } from '@/lib/types';
import { Loader2, Package, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Separator } from '@/components/ui/separator';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/lib/auth-store';


export default function OrderHistory() {
  const { user, isUserLoading } = useUser();
  const [orders, setOrders] = useState<Order[]>([]);
  const [areOrdersLoading, setAreOrdersLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (user) {
        // This is a mock implementation since we don't have a real DB connection here.
        // In a real app, this would be a Firestore query.
        const mockOrders = useAuthStore.getState().mockUsers.find(u => u.uid === user.uid)?.orders || [];
        setOrders(mockOrders);
        setAreOrdersLoading(false);
    } else if (!isUserLoading) {
        setAreOrdersLoading(false);
    }
  }, [user, isUserLoading]);


  const sortedOrders = orders
    ? [...orders].sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
    : [];

  if (isUserLoading || areOrdersLoading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[400px]">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p>Loading your order history...</p>
      </div>
    );
  }

  if (error) {
    return (
       <div className="flex flex-col items-center justify-center gap-4 text-destructive rounded-lg border-2 border-dashed border-destructive/50 p-12 min-h-[400px]">
        <AlertCircle className="h-10 w-10" />
        <h2 className="text-xl font-semibold">Error Loading Orders</h2>
        <p>There was a problem fetching your order history. Please try again later.</p>
       </div>
    )
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[400px]">
        <Package className="h-10 w-10" />
        <h2 className="text-xl font-semibold">Please log in</h2>
        <p>Log in to view your order history.</p>
        <Button asChild>
            <Link href="/login">Log In</Link>
        </Button>
      </div>
    );
  }
  
  if (sortedOrders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[400px]">
        <Package className="h-10 w-10" />
        <h2 className="text-xl font-semibold">No Orders Yet</h2>
        <p>You haven't placed any orders. Start exploring our creations!</p>
        <Button asChild>
            <Link href="/products">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <Card>
        <CardHeader>
            <CardTitle>My Orders</CardTitle>
            <CardDescription>Here is a list of your past and current orders.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
            {sortedOrders.map((order) => (
                <div key={order.id} className="p-6 border rounded-lg">
                    <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                        <div>
                            <h3 className="font-semibold text-lg">Order ID: <span className="font-mono text-sm text-muted-foreground">{order.id}</span></h3>
                            <p className="text-sm text-muted-foreground">
                                Date: {new Date(order.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                         <div className="text-right">
                           <Badge variant={order.status === 'Delivered' ? 'default' : 'secondary'}>{order.status}</Badge>
                            <p className="font-bold text-lg mt-1">Total: Rs.{order.total}</p>
                         </div>
                    </div>

                    <Separator className="my-4"/>

                    <div className="space-y-4">
                        {order.items.map((item) => (
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

                    <div className="mt-6 text-right">
                         <Button asChild>
                            <Link href={`/tracking/${order.id}`}>Track Order</Link>
                        </Button>
                    </div>
                </div>
            ))}
        </CardContent>
    </Card>
  );
}


'use client';

import { useCartStore } from '@/lib/cart-store';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ShoppingCart, X, Plus, Minus } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity } = useCartStore();

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground text-lg mt-2">Review your items before checkout.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Items ({items.reduce((acc, item) => acc + item.quantity, 0)})</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[300px]">
              <ShoppingCart className="w-16 h-16 mb-4" />
              <h2 className="text-xl font-semibold">Your cart is empty</h2>
              <p className="mt-2">Looks like you haven't added anything to your cart yet.</p>
              <Button asChild className="mt-6">
                <Link href="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div key={item.productId} className="flex items-center gap-4">
                  <div className="relative h-24 w-24 rounded-md overflow-hidden">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-grow">
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="text-sm text-muted-foreground">Rs.{item.price}</p>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity - 1)}>
                        <Minus className="h-4 w-4" />
                     </Button>
                     <Input
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.productId, parseInt(e.target.value, 10) || 1)}
                        className="w-16 text-center"
                     />
                     <Button variant="outline" size="icon" onClick={() => updateQuantity(item.productId, item.quantity + 1)}>
                        <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                  <div>
                    <p className="font-semibold">Rs.{(item.price * item.quantity)}</p>
                  </div>
                  <div>
                    <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                      <X className="h-5 w-5 text-muted-foreground" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}

          <Separator className="my-8" />
          
          <div className="flex flex-col md:flex-row items-start justify-between gap-8">
            <div className='flex flex-col gap-2'>
                <p className="text-sm text-muted-foreground">Have a discount code?</p>
                <form className="flex gap-2">
                    <Input placeholder="Discount code" className="w-auto" />
                    <Button variant="outline">Apply</Button>
                </form>
            </div>
            <div className="w-full md:max-w-sm space-y-4">
              <div className="flex justify-between font-semibold text-lg">
                <span>Subtotal</span>
                <span>Rs.{subtotal}</span>
              </div>
              <p className="text-sm text-muted-foreground">Shipping and taxes will be calculated at checkout.</p>
              <Button className="w-full" size="lg" disabled={items.length === 0}>
                Proceed to Checkout
              </Button>
               <Button variant="outline" className="w-full" asChild>
                  <Link href="/products">Continue Shopping</Link>
               </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

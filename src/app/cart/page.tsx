
'use client';

import { useCartStore } from '@/lib/cart-store';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Input } from '@/components/ui/input';
import { ShoppingCart, X, Plus, Minus, Tag, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { placeOrderAction } from '@/lib/auth-store';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useUser } from '@/lib/auth-store';
import PaymentDialog from '@/components/PaymentDialog';

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { user } = useUser();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);

  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  const handleCheckout = () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'Please log in to place an order.',
      });
      router.push('/login');
      return;
    }
    if (items.length > 0) {
      setIsPaymentDialogOpen(true);
    }
  };

  const confirmOrder = async () => {
    setIsLoading(true);
    setIsPaymentDialogOpen(false);
    try {
      const result = await placeOrderAction({ items, total: subtotal });
      
      if (result.success && result.orderId) {
        toast({
            title: 'Order Placed!',
            description: 'Your order has been successfully placed.',
        });
        clearCart();
        router.push(`/tracking/${result.orderId}`);
      } else {
        throw new Error(result.error || 'Failed to place order.');
      }

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Checkout Failed',
        description: error.message || 'There was a problem placing your order.',
      });
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <>
      <div className="container mx-auto py-12 px-4">
        <div className="text-center mb-12">
          <h1 className="font-headline text-4xl md:text-5xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground text-lg mt-2">Review your items before checkout.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 items-start">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Items ({totalItems})</CardTitle>
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
                      <div key={item.productId} className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                        <div className="relative h-24 w-24 rounded-md overflow-hidden self-center sm:self-auto shrink-0">
                          <Image
                            src={item.imageUrl}
                            alt={item.name}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="flex-grow">
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-muted-foreground">Unit Price: Rs.{item.price}</p>
                        </div>
                        <div className="flex items-center gap-2 self-center sm:self-auto">
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
                        <div className="font-semibold self-center sm:self-auto">
                          <span>Rs.{item.price * item.quantity}</span>
                        </div>
                        <div className="self-center sm:self-auto">
                          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.productId)}>
                            <X className="h-5 w-5 text-muted-foreground" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-1 space-y-6">
              <Card>
                  <CardHeader>
                    <CardTitle>Order Summary</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>Rs.{subtotal}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span className="text-primary">FREE</span>
                    </div>
                     <div className="flex justify-between">
                      <span>Taxes</span>
                      <span>Calculated at checkout</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>Rs.{subtotal}</span>
                    </div>
                  </CardContent>
                  <CardFooter className="flex-col gap-2">
                     <Button className="w-full" size="lg" disabled={items.length === 0 || isLoading} onClick={handleCheckout}>
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      Proceed to Checkout
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                        <Link href="/products">Continue Shopping</Link>
                    </Button>
                  </CardFooter>
              </Card>

               <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Tag className="w-5 h-5"/>
                      Apply Discount
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <form className="flex gap-2">
                        <Input placeholder="Discount code" />
                        <Button variant="outline">Apply</Button>
                    </form>
                  </CardContent>
              </Card>
          </div>
        </div>
      </div>
      <PaymentDialog
        isOpen={isPaymentDialogOpen}
        onClose={() => setIsPaymentDialogOpen(false)}
        onConfirm={confirmOrder}
        total={subtotal}
      />
    </>
  );
}

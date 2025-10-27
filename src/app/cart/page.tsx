
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart } from 'lucide-react';

export default function CartPage() {
  return (
    <div className="container mx-auto py-12 px-4">
      <div className="text-center mb-12">
        <h1 className="font-headline text-4xl md:text-5xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground text-lg mt-2">Review your items before checkout.</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Your Items (0)</CardTitle>
        </CardHeader>
        <CardContent>
            <div className="flex flex-col items-center justify-center text-center text-muted-foreground rounded-lg border-2 border-dashed p-12 min-h-[300px]">
                <ShoppingCart className="w-16 h-16 mb-4" />
                <h2 className="text-xl font-semibold">Your cart is empty</h2>
                <p className="mt-2">Looks like you haven't added anything to your cart yet.</p>
                <Button className="mt-6">Continue Shopping</Button>
            </div>
            <Separator className="my-8" />
            <div className="flex justify-end">
                <div className="w-full max-w-sm space-y-4">
                    <div className="flex justify-between font-bold text-lg">
                        <span>Subtotal</span>
                        <span>$0.00</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Shipping and taxes will be calculated at checkout.</p>
                    <Button className="w-full" size="lg" disabled>Proceed to Checkout</Button>
                </div>
            </div>
        </CardContent>
      </Card>
    </div>
  );
}


'use client';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { CreditCard, Landmark, IndianRupee } from 'lucide-react';
import { useState } from 'react';

interface PaymentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  total: number;
}

const paymentMethods = [
  { id: 'cod', label: 'Cash on Delivery', icon: IndianRupee },
  { id: 'upi', label: 'UPI / Net Banking', icon: Landmark },
  { id: 'card', label: 'Debit / Credit Card', icon: CreditCard },
];

export default function PaymentDialog({ isOpen, onClose, onConfirm, total }: PaymentDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState('card');

  return (
    <AlertDialog open={isOpen} onOpenChange={onClose}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Confirm Your Order</AlertDialogTitle>
          <AlertDialogDescription>
            Select a payment method to complete your purchase of Rs.{total}.
          </AlertDialogDescription>
        </AlertDialogHeader>
        
        <div className="py-4">
          <RadioGroup value={selectedMethod} onValueChange={setSelectedMethod}>
            {paymentMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Label
                  key={method.id}
                  htmlFor={method.id}
                  className="flex items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground [&:has([data-state=checked])]:border-primary"
                >
                  <div className="flex items-center gap-3">
                    <Icon className="h-6 w-6" />
                    <span className="font-medium">{method.label}</span>
                  </div>
                  <RadioGroupItem value={method.id} id={method.id} />
                </Label>
              );
            })}
          </RadioGroup>
        </div>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm}>Confirm Order</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

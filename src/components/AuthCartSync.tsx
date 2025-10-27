
'use client';

import { useEffect } from 'react';
import { useFirebase } from '@/firebase';
import { useCartStore } from '@/lib/cart-store';

/**
 * An invisible component that syncs the cart state with the user's auth state.
 * It ensures the cart is initialized correctly when the auth state is resolved.
 */
export function AuthCartSync() {
  const { isUserLoading } = useFirebase();
  const { initializeCart, isCartInitialized } = useCartStore();

  useEffect(() => {
    // When auth state is resolved (no longer loading), initialize the cart
    // if it hasn't been initialized already.
    if (!isUserLoading && !isCartInitialized) {
      initializeCart();
    }
  }, [isUserLoading, isCartInitialized, initializeCart]);

  // This component renders nothing.
  return null;
}

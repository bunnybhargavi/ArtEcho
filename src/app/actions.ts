'use server';

import {
  generateArtisanStoryCard,
  type GenerateArtisanStoryCardInput,
  type GenerateArtisanStoryCardOutput,
} from '@/ai/flows/generate-artisan-story-card';

import {
  matchArtisansToBrand,
  type MatchArtisansToBrandInput,
  type MatchArtisansToBrandOutput,
} from '@/ai/flows/match-artisans-to-brand-flow';
import { addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { getSdks } from '@/firebase';
import { collection, addDoc, writeBatch, getDocs, doc } from 'firebase/firestore';
import { CartItem } from '@/lib/cart-store';
import { headers } from 'next/headers';
import { getAuth } from 'firebase/auth';
import { initializeApp, getApps, getApp } from 'firebase/app';
import { firebaseConfig } from '@/firebase/config';

// Helper to get user server-side
async function getUserId() {
    const auth = getAuth(getApps().length ? getApp() : initializeApp(firebaseConfig));
    // This is a placeholder. In a real app, you'd get the user from the session/token.
    // For this environment, we'll assume an anonymous or fixed user for server actions.
    // The most reliable way to get user on server is not straightforward in Next.js App Router without a dedicated library.
    // We will proceed assuming the client will pass the user ID, or handle auth state on client before calling.
    // For this action, we'll rely on the client being authenticated.
    return auth.currentUser?.uid;
}


export async function generateArtisanStoryCardAction(
  input: GenerateArtisanStoryCardInput
): Promise<GenerateArtisanStoryCardOutput> {
  try {
    const result = await generateArtisanStoryCard(input);
    return result;
  } catch (error) {
    console.error('Error in generateArtisanStoryCardAction:', error);
    throw new Error('Failed to generate story card.');
  }
}


export async function matchArtisansToBrandAction(
  input: MatchArtisansToBrandInput
): Promise<MatchArtisansToBrandOutput> {
  try {
    const result = await matchArtisansToBrand(input);
    return result;
  } catch (error) {
    console.error('Error in matchArtisansToBrandAction:', error);
    throw new Error('Failed to generate artisan matches.');
  }
}

export async function submitContactFormAction(formData: {
  name: string;
  email: string;
  message: string;
}) {
  try {
    const { firestore } = getSdks(null as any); // SDKs are initialized on the client
    const contactMessagesRef = collection(firestore, 'contactMessages');
    
    await addDocumentNonBlocking(contactMessagesRef, {
      ...formData,
      timestamp: new Date().toISOString(),
    });

    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit message.' };
  }
}


export async function placeOrderAction(data: {
  items: CartItem[];
  total: number;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    // This is tricky server-side. We rely on the client to be authenticated.
    // A robust solution uses NextAuth.js or similar to manage server-side sessions.
    const headersList = headers();
    // Assuming a user ID could be passed in headers from a client-side fetch wrapper
    const userId = headersList.get('x-user-id'); 

    if (!userId) {
        return { success: false, error: 'User not authenticated.' };
    }

    const { firestore } = getSdks(getApp());
    const ordersRef = collection(firestore, 'users', userId, 'orders');
    
    const newOrder = {
      userId,
      items: data.items,
      total: data.total,
      status: 'Placed' as const,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(ordersRef, newOrder);

    // After creating the order, clear the cart
    const cartRef = collection(firestore, 'users', userId, 'cart');
    const cartSnapshot = await getDocs(cartRef);
    const batch = writeBatch(firestore);
    cartSnapshot.docs.forEach((cartDoc) => {
      batch.delete(doc(cartRef, cartDoc.id));
    });
    await batch.commit();

    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error('Error placing order:', error);
    return { success: false, error: error.message || 'Failed to place order.' };
  }
}

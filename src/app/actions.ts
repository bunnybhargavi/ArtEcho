
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
import { initializeFirebase } from '@/firebase';
import {
  collection,
  addDoc,
  writeBatch,
  getDocs,
  doc,
  setDoc,
} from 'firebase/firestore';
import { CartItem } from '@/lib/cart-store';
import { headers } from 'next/headers';

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
    const { firestore } = initializeFirebase();
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
    const headersList = headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      return { success: false, error: 'User not authenticated.' };
    }

    const { firestore } = initializeFirebase();
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


export async function placeSingleItemOrderAction(item: CartItem): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id'); 

    if (!userId) {
      return { success: false, error: 'User not authenticated.' };
    }

    const { firestore } = initializeFirebase();
    const ordersRef = collection(firestore, 'users', userId, 'orders');
    
    const newOrder = {
      userId,
      items: [{...item, quantity: 1}], // Ensure quantity is 1 for a single purchase
      total: item.price,
      status: 'Placed' as const,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(ordersRef, newOrder);

    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    console.error('Error placing single item order:', error);
    return { success: false, error: error.message || 'Failed to place order.' };
  }
}

export async function updateUserThemeAction(theme: 'light' | 'dark' | 'system') {
  try {
    const headersList = headers();
    const userId = headersList.get('x-user-id');

    if (!userId) {
      // Not an error, just means a guest is changing themes.
      return { success: true };
    }

    const { firestore } = initializeFirebase();
    const userDocRef = doc(firestore, 'users', userId);

    await setDoc(userDocRef, { theme }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user theme:', error);
    return { success: false, error: error.message || 'Failed to update theme.' };
  }
}

    
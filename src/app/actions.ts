
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
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';


async function getUserIdFromToken(): Promise<string | null> {
    // This function is temporarily disabled to prevent server crashes.
    // We will re-implement this securely.
    const headersList = headers();
    const userId = headersList.get('x-user-id');
    return userId || null;
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
  const { firestore } = initializeFirebase();
  const contactMessagesRef = collection(firestore, 'contactMessages');
  const submissionData = {
    ...formData,
    timestamp: new Date().toISOString(),
  };

  return addDoc(contactMessagesRef, submissionData)
    .then(() => ({ success: true }))
    .catch((error) => {
      // This is the correct place to emit the contextual error.
      const permissionError = new FirestorePermissionError({
        path: contactMessagesRef.path,
        operation: 'create',
        requestResourceData: submissionData,
      });
      errorEmitter.emit('permission-error', permissionError);
      
      // Also return a failure state to the client.
      console.error('Error submitting contact form:', error);
      return { success: false, error: 'Failed to submit message.' };
    });
}


export async function placeOrderAction(data: {
  items: CartItem[];
  total: number;
}): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const userId = await getUserIdFromToken();

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

    const docRef = await addDoc(ordersRef, newOrder)
      .catch(error => {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: ordersRef.path,
                operation: 'create',
                requestResourceData: newOrder,
            })
        );
        // Re-throw to be caught by the outer try/catch
        throw error;
      });

    // After creating the order, clear the cart
    const cartRef = collection(firestore, 'users', userId, 'cart');
    const cartSnapshot = await getDocs(cartRef);
    const batch = writeBatch(firestore);
    cartSnapshot.docs.forEach((cartDoc) => {
      batch.delete(doc(cartRef, cartDoc.id));
    });
    
    // Add specific error handling for the batch commit
    await batch.commit().catch(error => {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: cartRef.path, // The path for the batch operation is the collection path
                operation: 'delete',
            })
        );
        // Re-throw to be caught by the outer try/catch
        throw error;
    });

    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    // The console.error is a fallback for non-permission errors
    console.error('Error placing order:', error);
    return { success: false, error: error.message || 'Failed to place order.' };
  }
}


export async function placeSingleItemOrderAction(item: CartItem): Promise<{ success: boolean; orderId?: string; error?: string }> {
  try {
    const userId = await getUserIdFromToken();

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

    const docRef = await addDoc(ordersRef, newOrder)
     .catch(error => {
        errorEmitter.emit(
            'permission-error',
            new FirestorePermissionError({
                path: ordersRef.path,
                operation: 'create',
                requestResourceData: newOrder,
            })
        );
        // Re-throw to be caught by the outer try/catch
        throw error;
      });

    return { success: true, orderId: docRef.id };
  } catch (error: any)
{
    console.error('Error placing single item order:', error);
    return { success: false, error: error.message || 'Failed to place order.' };
  }
}

export async function updateUserThemeAction(theme: 'light' | 'dark' | 'system') {
  try {
    const userId = await getUserIdFromToken();

    if (!userId) {
      // Not an error, just means a guest is changing themes.
      return { success: true };
    }

    const { firestore } = initializeFirebase();
    const userDocRef = doc(firestore, 'users', userId);

    setDoc(userDocRef, { theme }, { merge: true })
        .catch(error => {
            errorEmitter.emit(
                'permission-error',
                new FirestorePermissionError({
                    path: userDocRef.path,
                    operation: 'update',
                    requestResourceData: { theme },
                })
            );
        });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating user theme:', error);
    return { success: false, error: error.message || 'Failed to update theme.' };
  }
}

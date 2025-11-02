
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
import { useAuthStore } from '@/lib/auth-store';


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
  const user = useAuthStore.getState().user;

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }
  const userId = user.uid;

  const { firestore } = initializeFirebase();
  const ordersRef = collection(firestore, 'users', userId, 'orders');
  const cartRef = collection(firestore, 'users', userId, 'cart');

  const newOrder = {
    userId,
    items: data.items,
    total: data.total,
    status: 'Placed' as const,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(ordersRef, newOrder);

    const cartSnapshot = await getDocs(cartRef);
    const batch = writeBatch(firestore);
    cartSnapshot.docs.forEach((cartDoc) => {
      batch.delete(doc(cartRef, cartDoc.id));
    });
    
    await batch.commit();

    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    const operation = 'create';
    const path = ordersRef.path;

    const permissionError = new FirestorePermissionError({
        path: path,
        operation: operation,
        requestResourceData: newOrder,
    });
    errorEmitter.emit('permission-error', permissionError);

    return { success: false, error: error.message || 'Failed to place order.' };
  }
}


export async function placeSingleItemOrderAction(item: CartItem): Promise<{ success: boolean; orderId?: string; error?: string }> {
  const user = useAuthStore.getState().user;

  if (!user) {
    return { success: false, error: 'User not authenticated.' };
  }
  const userId = user.uid;
  const { firestore } = initializeFirebase();
  const ordersRef = collection(firestore, 'users', userId, 'orders');

  const newOrder = {
    userId,
    items: [item],
    total: item.price * item.quantity,
    status: 'Placed' as const,
    createdAt: new Date().toISOString(),
  };

  try {
    const docRef = await addDoc(ordersRef, newOrder);
    return { success: true, orderId: docRef.id };
  } catch (error: any) {
    const permissionError = new FirestorePermissionError({
        path: ordersRef.path,
        operation: 'create',
        requestResourceData: newOrder,
    });
    errorEmitter.emit('permission-error', permissionError);

    return { success: false, error: error.message || 'Failed to place order.' };
  }
}

export async function updateUserThemeAction(theme: 'light' | 'dark' | 'system') {
  try {
    const user = useAuthStore.getState().user;
    if (!user) {
      // Not an error, just means a guest is changing themes.
      return { success: true };
    }
    const userId = user.uid;

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

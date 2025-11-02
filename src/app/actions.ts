
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
} from 'firebase/firestore';
import { CartItem } from '@/lib/cart-store';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError, type SecurityRuleContext } from '@/firebase/errors';
import { useAuthStore } from '@/lib/auth-store';


export async function generateArtisanStoryCardAction(
  input: GenerateArtisanStoryCardInput
): Promise<GenerateArtisanStoryCardOutput> {
  const { firestore } = initializeFirebase();
  const storyCardCollection = collection(firestore, 'storyCards');

  // Generate the story first
  const result = await generateArtisanStoryCard(input);

  const newStoryCardData = {
    productId: input.productId,
    artisanId: input.artisanId,
    description: result.storyCardDescription,
    audioUrl: result.audioDataUri,
    createdAt: new Date().toISOString(),
  };

  // Save the generated story card to Firestore without blocking
  addDoc(storyCardCollection, newStoryCardData)
    .catch(async (serverError) => {
      const permissionError = new FirestorePermissionError({
        path: storyCardCollection.path,
        operation: 'create',
        requestResourceData: newStoryCardData,
      } satisfies SecurityRuleContext);

      errorEmitter.emit('permission-error', permissionError);

      // We still throw an error to be caught by the client-side action handler
      // This allows the UI to know the operation failed.
      throw new Error('Failed to save story card due to permissions.');
    });

  // Return the generated content immediately for a responsive UI
  return result;
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
  // This is a mock implementation
  console.log('Contact form submitted:', formData);
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

export async function updateUserThemeAction(theme: 'light' | 'dark' | 'system') {
  try {
    const user = useAuthStore.getState().user;
    if (!user) {
      // Not an error, just means a guest is changing themes.
      return { success: true };
    }
    // Mock saving the theme. In a real app, you would save this to a database.
    console.log(`Updating theme for ${user.uid} to ${theme}`);
    await new Promise(resolve => setTimeout(resolve, 200));
    
    return { success: true };
  } catch (error: any) {
    console.error('Error updating user theme:', error);
    return { success: false, error: error.message || 'Failed to update theme.' };
  }
}

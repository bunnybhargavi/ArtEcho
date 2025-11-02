
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
    const { firestore } = initializeFirebase();
    
    // Save the generated story card to Firestore
    const storyCardCollection = collection(firestore, 'storyCards');
    addDoc(storyCardCollection, {
      productId: input.productId,
      artisanId: input.artisanId,
      description: result.storyCardDescription,
      audioUrl: result.audioDataUri,
      createdAt: new Date().toISOString(),
    });

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

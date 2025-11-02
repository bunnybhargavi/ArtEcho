
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

import { getFirebaseAdminApp } from '@/firebase/admin';
import { getFirestore } from 'firebase-admin/firestore';
import { useAuthStore } from '@/lib/auth-store';
import type { Artisan, Product } from '@/lib/types';


export async function generateArtisanStoryCardAction(
  input: { artisan: Artisan, product: Product, productPhotoDataUri: string }
): Promise<GenerateArtisanStoryCardOutput> {
  try {
    const adminApp = getFirebaseAdminApp();
    const firestore = getFirestore(adminApp);
    const storyCardCollection = firestore.collection('storyCards');

    const flowInput: GenerateArtisanStoryCardInput = {
        artisanId: input.artisan.id,
        productId: input.product.id,
        artisanName: input.artisan.name,
        craft: input.artisan.craft,
        location: input.artisan.location,
        artisanStory: input.artisan.story,
        productName: input.product.name,
        productDescription: input.product.description,
        productPhotoDataUri: input.productPhotoDataUri
    };
  
    // Generate the story first
    const result = await generateArtisanStoryCard(flowInput);
  
    const newStoryCardData = {
      productId: flowInput.productId,
      artisanId: flowInput.artisanId,
      description: result.storyCardDescription,
      audioUrl: result.audioDataUri,
      createdAt: new Date().toISOString(),
    };
  
    // Non-blocking write
    storyCardCollection.add(newStoryCardData).catch((error) => {
        console.error("Failed to save story card:", error);
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
  try {
    const adminApp = getFirebaseAdminApp();
    const firestore = getFirestore(adminApp);
    const contactMessagesCollection = firestore.collection('contactMessages');

    const newMessage = {
      ...formData,
      timestamp: new Date().toISOString(),
    };

    await contactMessagesCollection.add(newMessage);
    return { success: true };
  } catch (error) {
    console.error('Error submitting contact form:', error);
    return { success: false, error: 'Failed to submit message.' };
  }
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

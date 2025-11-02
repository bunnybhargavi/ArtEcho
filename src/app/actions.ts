
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
): Promise<{ success: boolean; data?: GenerateArtisanStoryCardOutput; message?: string }> {
  try {
    // 1. Input Validation
    if (!input.artisan || !input.product || !input.productPhotoDataUri) {
      const errorMsg = 'Invalid input. Please provide all required fields.';
      console.error('Validation Error:', errorMsg);
      return { success: false, message: errorMsg };
    }
  
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

    // 2. Graceful AI Call
    const result = await generateArtisanStoryCard(flowInput);

    if (!result || !result.storyCardDescription) {
        throw new Error('AI failed to generate a story description.');
    }
  
    // 3. Firestore Write with feedback
    const newStoryCardData = {
      productId: input.product.id,
      artisanId: input.artisan.id,
      description: result.storyCardDescription,
      audioUrl: result.audioDataUri,
      createdAt: new Date().toISOString(),
    };
  
    storyCardCollection.add(newStoryCardData).catch((error) => {
        console.error("Firestore Write Error: Failed to save story card:", error);
    });
    
    console.log("Generated story card:", result);
    return { success: true, data: result };

  } catch (error: any) {
    console.error('Critical Error in generateArtisanStoryCardAction:', error);
    const response = { success: false, message: error.message || 'Failed to generate story card due to an unexpected server error.' };
    console.log('Returning response:', response);
    return response;
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

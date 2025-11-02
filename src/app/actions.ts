
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
import { artisans, products } from '@/lib/data';


export async function generateArtisanStoryCardAction(
  input: { artisanId: string; productId: string, productPhotoDataUri: string }
): Promise<{ success: boolean; data?: GenerateArtisanStoryCardOutput; message?: string }> {
  // 1. Input Validation
  if (!input.artisanId || !input.productId || !input.productPhotoDataUri) {
    const errorMsg = 'Invalid input. Please provide all required fields.';
    console.error('Validation Error:', errorMsg);
    const response = { success: false, message: errorMsg };
    console.log('Returning response:', response);
    return response;
  }
  
  const artisan = artisans.find(a => a.id === input.artisanId);
  const product = products.find(p => p.id === input.productId);

  if (!artisan || !product) {
    const errorMsg = `Data Error: Could not find artisan with ID '${input.artisanId}' or product with ID '${input.productId}'.`;
    console.error(errorMsg);
    const response = { success: false, message: 'Artisan or product data could not be found.' };
    console.log('Returning response:', response);
    return response;
  }

  try {
    const adminApp = getFirebaseAdminApp();
    const firestore = getFirestore(adminApp);
    const storyCardCollection = firestore.collection('storyCards');

    const flowInput: GenerateArtisanStoryCardInput = {
        artisanId: input.artisanId,
        productId: input.productId,
        artisanName: artisan.name,
        craft: artisan.craft,
        location: artisan.location,
        artisanStory: artisan.story,
        productName: product.name,
        productDescription: product.description,
        productPhotoDataUri: input.productPhotoDataUri
    };
  
    // 2. Graceful AI Call
    const result = await generateArtisanStoryCard(flowInput);

    if (!result || !result.storyCardDescription) {
        throw new Error('AI failed to generate a story description.');
    }
  
    // 3. Firestore Write with feedback
    const newStoryCardData = {
      productId: flowInput.productId,
      artisanId: flowInput.artisanId,
      description: result.storyCardDescription,
      audioUrl: result.audioDataUri,
      createdAt: new Date().toISOString(),
    };
  
    // Non-blocking write, but log potential errors
    storyCardCollection.add(newStoryCardData).catch((error) => {
        console.error("Firestore Write Error: Failed to save story card:", error);
        // This is a background error, so we don't block the user response.
        // In a production app, you might add this to a retry queue or monitoring system.
    });
    
    const response = { success: true, data: result };
    console.log('Returning response:', response);
    return response;

  } catch (error: any) {
    // 4. Centralized Error Handling & Logging
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

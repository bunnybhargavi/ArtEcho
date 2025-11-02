
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


export async function generateArtisanStoryCardAction(
  input: GenerateArtisanStoryCardInput
): Promise<GenerateArtisanStoryCardOutput> {
  const adminApp = getFirebaseAdminApp();
  const firestore = getFirestore(adminApp);
  const storyCardCollection = firestore.collection('storyCards');

  // Generate the story first
  const result = await generateArtisanStoryCard(input);

  const newStoryCardData = {
    productId: input.productId,
    artisanId: input.artisanId,
    description: result.storyCardDescription,
    audioUrl: result.audioDataUri,
    createdAt: new Date().toISOString(),
  };
  
  // Asynchronously save the generated story card to Firestore.
  // We don't await this so the UI can update immediately.
  storyCardCollection.add(newStoryCardData).catch((error) => {
      // In a real app, you'd want robust logging here.
      console.error("Failed to save story card due to permissions or other server error:", error);
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


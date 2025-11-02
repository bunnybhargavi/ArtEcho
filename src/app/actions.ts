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

import {
  generateAudioFromText
} from '@/ai/flows/generate-audio-from-text';


import { setDocumentNonBlocking, addDocumentNonBlocking } from '@/firebase/non-blocking-updates';
import { getSdks } from '@/firebase';
import { collection, doc } from 'firebase/firestore';
import { getFirebaseAdminApp } from '@/firebase/admin';
import { getAuth } from 'firebase-admin/auth';
import type { GenerateAudioFromTextInput, GenerateAudioFromTextOutput } from '@/lib/types';


export async function generateArtisanStoryCardAction(
  input: GenerateArtisanStoryCardInput
): Promise<{ success: boolean; data?: GenerateArtisanStoryCardOutput; message?: string }> {
  try {
    const result = await generateArtisanStoryCard(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in generateArtisanStoryCardAction:', error);
    return { success: false, message: error.message || 'Failed to generate story card.' };
  }
}

export async function generateAudioAction(
  input: GenerateAudioFromTextInput
): Promise<{ success: boolean; data?: GenerateAudioFromTextOutput, message?: string }> {
   try {
    const result = await generateAudioFromText(input);
    return { success: true, data: result };
  } catch (error: any) {
    console.error('Error in generateAudioAction:', error);
    return { success: false, message: error.message || 'Failed to generate audio.' };
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

export async function updateUserThemeAction(theme: 'light' | 'dark') {
  try {
    const app = getFirebaseAdminApp();
    const adminAuth = getAuth(app);
    // This is a placeholder for getting the current user's ID.
    // In a real app, you would get this from the session.
    const uid = (await adminAuth.listUsers()).users[0].uid;
    const { firestore } = getSdks(null as any);
    const userDocRef = doc(firestore, 'users', uid);
    
    setDocumentNonBlocking(userDocRef, { theme }, { merge: true });

    return { success: true };
  } catch (error: any) {
    console.error('Error updating theme:', error);
    return { success: false, error: error.message || 'Failed to update theme.' };
  }
}

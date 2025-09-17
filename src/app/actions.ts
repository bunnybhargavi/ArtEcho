'use server';

import {
  generateArtisanStoryCard,
  type GenerateArtisanStoryCardInput,
  type GenerateArtisanStoryCardOutput,
} from '@/ai/flows/generate-artisan-story-card';

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

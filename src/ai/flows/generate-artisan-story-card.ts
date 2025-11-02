
'use server';
/**
 * @fileOverview An artisan story card generation AI agent.
 *
 * - generateArtisanStoryCard - A function that handles the artisan story card generation process.
 * - GenerateArtisanStoryCardInput - The input type for the generateArtisanStoryCard function.
 * - GenerateArtisanStoryCardOutput - The return type for the generateArtisanStoryCard function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

const GenerateArtisanStoryCardInputSchema = z.object({
  artisanId: z.string().describe("The ID of the artisan."),
  productId: z.string().describe("The ID of the product."),
  artisanName: z.string().describe('The name of the artisan.'),
  craft: z.string().describe('The type of craft the artisan specializes in.'),
  location: z.string().describe('The location of the artisan.'),
  artisanStory: z.string().describe('The personal story of the artisan.'),
  productName: z.string().describe('The name of the product.'),
  productDescription: z.string().describe('A detailed description of the product.'),
  productPhotoDataUri: z
    .string()
    .describe(
      "A photo of the product, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateArtisanStoryCardInput = z.infer<typeof GenerateArtisanStoryCardInputSchema>;

const GenerateArtisanStoryCardOutputSchema = z.object({
  storyCardDescription: z.string().describe('A translated and engaging story card description for the artisan and their product.'),
  audioDataUri: z.string().describe('A data URI for the audio recording of the story card description.'),
});
export type GenerateArtisanStoryCardOutput = z.infer<typeof GenerateArtisanStoryCardOutputSchema>;

export async function generateArtisanStoryCard(input: GenerateArtisanStoryCardInput): Promise<GenerateArtisanStoryCardOutput> {
  return generateArtisanStoryCardFlow(input);
}

const storyCardPrompt = ai.definePrompt({
  name: 'storyCardPrompt',
  model: googleAI.model('gemini-pro'),
  input: {schema: z.object({
    artisanName: z.string(),
    craft: z.string(),
    location: z.string(),
    artisanStory: z.string(),
    productName: z.string(),
    productDescription: z.string(),
    productPhotoDataUri: z.string(),
  })},
  output: {schema: z.object({ storyCardDescription: z.string() })},
  prompt: `You are a marketing expert specializing in creating engaging story cards for artisans. Your goal is to craft a compelling narrative that connects the artisan's personal story with their product, highlighting the craft, location, and unique qualities of both.

  Artisan Name: {{{artisanName}}}
  Craft: {{{craft}}}
  Location: {{{location}}}
  Artisan Story: {{{artisanStory}}}
  Product Name: {{{productName}}}
  Product Description: {{{productDescription}}}
  Product Photo: {{media url=productPhotoDataUri}}

  Create an engaging story card description that captures the essence of the artisan and their product. This description will be used in marketing materials and should entice potential customers. The description should be no more than 150 words.
  Return only the story card description.
`,
});

const generateArtisanStoryCardFlow = ai.defineFlow(
  {
    name: 'generateArtisanStoryCardFlow',
    inputSchema: GenerateArtisanStoryCardInputSchema,
    outputSchema: GenerateArtisanStoryCardOutputSchema,
  },
  async input => {
    // Step 1: Generate the story description text.
    const textGenerationResult = await storyCardPrompt(input);
    const storyCardDescription = textGenerationResult.output?.storyCardDescription;

    if (!storyCardDescription) {
        throw new Error("Failed to generate a story description. The AI model returned an empty response.");
    }
    
    // Step 2: Generate audio from the generated description.
    const ttsResponse = await ai.generate({
      model: googleAI.model('gemini-2.5-flash-preview-tts'),
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Algenib' },
          },
        },
      },
      prompt: storyCardDescription
    });

    if (!ttsResponse.media?.url) {
        throw new Error("Failed to generate audio. The text-to-speech model did not return audio data.");
    }
    
    // Step 3: Convert the raw PCM audio data to a WAV data URI.
    const audioBuffer = Buffer.from(
      ttsResponse.media.url.substring(ttsResponse.media.url.indexOf(',') + 1),
      'base64'
    );
    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
      storyCardDescription: storyCardDescription,
      audioDataUri: audioDataUri,
    };
  }
);

async function toWav(
  pcmData: Buffer,
  channels = 1,
  rate = 24000,
  sampleWidth = 2
): Promise<string> {
  return new Promise((resolve, reject) => {
    const writer = new wav.Writer({
      channels,
      sampleRate: rate,
      bitDepth: sampleWidth * 8,
    });

    const bufs: any[] = [];
    writer.on('error', reject);
    writer.on('data', (d) => bufs.push(d));
    writer.on('end', () => resolve(Buffer.concat(bufs).toString('base64')));

    writer.end(pcmData);
  });
}

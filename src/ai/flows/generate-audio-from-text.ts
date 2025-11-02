
'use server';
/**
 * @fileOverview An AI agent for generating audio from text.
 *
 * - generateAudioFromText - A function that takes text and returns a WAV audio data URI.
 * - GenerateAudioFromTextInput - The input type for the function.
 * - GenerateAudioFromTextOutput - The return type for the function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';
import wav from 'wav';
import { googleAI } from '@genkit-ai/google-genai';

export const GenerateAudioFromTextInputSchema = z.object({
  text: z.string().min(1).describe('The text to be converted to speech.'),
});
export type GenerateAudioFromTextInput = z.infer<typeof GenerateAudioFromTextInputSchema>;

export const GenerateAudioFromTextOutputSchema = z.object({
  audioDataUri: z.string().describe('A data URI for the audio recording of the provided text.'),
});
export type GenerateAudioFromTextOutput = z.infer<typeof GenerateAudioFromTextOutputSchema>;

export async function generateAudioFromText(input: GenerateAudioFromTextInput): Promise<GenerateAudioFromTextOutput> {
  return generateAudioFromTextFlow(input);
}

const generateAudioFromTextFlow = ai.defineFlow(
  {
    name: 'generateAudioFromTextFlow',
    inputSchema: GenerateAudioFromTextInputSchema,
    outputSchema: GenerateAudioFromTextOutputSchema,
  },
  async ({ text }) => {
    // Step 1: Generate audio from the provided text.
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
      prompt: text,
    });

    if (!ttsResponse.media?.url) {
      throw new Error('Failed to generate audio. The text-to-speech model did not return audio data.');
    }

    // Step 2: Convert the raw PCM audio data to a WAV data URI.
    const audioBuffer = Buffer.from(
      ttsResponse.media.url.substring(ttsResponse.media.url.indexOf(',') + 1),
      'base64'
    );
    const audioDataUri = 'data:audio/wav;base64,' + (await toWav(audioBuffer));

    return {
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

'use server';
/**
 * @fileOverview An AI agent for converting text to audio.
 *
 * - generateAudioFromText - A function that takes text and returns a data URI for the audio.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import wav from 'wav';
import { GenerateAudioFromTextInputSchema, GenerateAudioFromTextOutputSchema } from '@/lib/types';

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

    const bufs: Buffer[] = [];
    writer.on('error', reject);
    writer.on('data', (d: Buffer) => {
      bufs.push(d);
    });
    writer.on('end', () => {
      resolve(Buffer.concat(bufs).toString('base64'));
    });

    writer.write(pcmData);
    writer.end();
  });
}

const generateAudioFlow = ai.defineFlow(
  {
    name: 'generateAudioFlow',
    inputSchema: GenerateAudioFromTextInputSchema,
    outputSchema: GenerateAudioFromTextOutputSchema,
  },
  async ({ text }) => {
    const ttsResponse = await ai.generate({
      model: 'googleai/gemini-2.5-flash-preview-tts',
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

    if (!ttsResponse.media) {
      throw new Error('Audio generation failed: no media returned.');
    }

    const audioBuffer = Buffer.from(
      ttsResponse.media.url.substring(ttsResponse.media.url.indexOf(',') + 1),
      'base64'
    );

    const wavBase64 = await toWav(audioBuffer);
    const audioDataUri = 'data:audio/wav;base64,' + wavBase64;

    return { audioDataUri };
  }
);


export async function generateAudioFromText(input: z.infer<typeof GenerateAudioFromTextInputSchema>): Promise<z.infer<typeof GenerateAudioFromTextOutputSchema>> {
    return generateAudioFlow(input);
}

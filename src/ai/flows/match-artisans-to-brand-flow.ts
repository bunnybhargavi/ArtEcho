'use server';
/**
 * @fileOverview An AI agent for matching artisans and products to a brand's identity.
 *
 * - matchArtisansToBrand - A function that recommends artisans and products based on brand style and market trends.
 * - MatchArtisansToBrandInput - The input type for the matchArtisansToBrand function.
 * - MatchArtisansToBrandOutput - The return type for the matchArtisansToBrand function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'zod';
import { products, artisans } from '@/lib/data';

const MatchArtisansToBrandInputSchema = z.object({
  brandStyle: z.string().describe('The stylistic identity of the brand (e.g., minimalist, bohemian, luxury).'),
  marketTrends: z.string().describe('Current market trends the brand is interested in (e.g., sustainability, bold colors).'),
});
export type MatchArtisansToBrandInput = z.infer<typeof MatchArtisansToBrandInputSchema>;

const RecommendationSchema = z.object({
    artisanId: z.string().describe("The ID of the recommended artisan."),
    productId: z.string().optional().describe("The ID of a specific product that is a good match."),
    reason: z.string().describe("A concise explanation of why this artisan/product is a good match for the brand."),
});

const MatchArtisansToBrandOutputSchema = z.object({
  recommendations: z.array(RecommendationSchema).describe('A list of recommended artisans and products.'),
});
export type MatchArtisansToBrandOutput = z.infer<typeof MatchArtisansToBrandOutputSchema>;


export async function matchArtisansToBrand(input: MatchArtisansToBrandInput): Promise<MatchArtisansToBrandOutput> {
  return matchArtisansToBrandFlow(input);
}

const matchmakingPrompt = ai.definePrompt({
  name: 'matchmakingPrompt',
  input: {schema: MatchArtisansToBrandInputSchema},
  output: {schema: MatchArtisansToBrandOutputSchema},
  prompt: `You are an expert brand consultant and trend analyst for the artisan craft market. Your goal is to match a brand with artisans and products that align with its style and current market trends.

Analyze the provided brand identity and market trends. Then, review the list of available artisans and their products to find the best matches.

**Brand Identity & Market Trends:**
- Brand Style: {{{brandStyle}}}
- Market Trends: {{{marketTrends}}}

**Available Artisans and Products:**
Here is the data you must use for recommendations. Do not use any other data.
Artisans:
{{#each artisans}}
- ID: {{this.id}}, Name: {{this.name}}, Craft: {{this.craft}}, Location: {{this.location}}, Story: {{this.story}}
{{/each}}

Products:
{{#each products}}
- ID: {{this.id}}, Artisan ID: {{this.artisanId}}, Name: {{this.name}}, Description: {{this.description}}, Price: {{this.price}}, Tags: {{#each this.tags}}{{{this}}}{{/each}}
{{/each}}

Based on your analysis, provide a list of 3-5 recommendations. For each recommendation, provide the artisan's ID, an optional specific product ID if one is a standout match, and a concise reason for the recommendation. For example, you might say "This handloom fabric matches luxury scarf trends" or "Eco-friendly clay pots align with sustainable lifestyle brands."
`,
});

const matchArtisansToBrandFlow = ai.defineFlow(
  {
    name: 'matchArtisansToBrandFlow',
    inputSchema: MatchArtisansToBrandInputSchema,
    outputSchema: MatchArtisansToBrandOutputSchema,
  },
  async (input) => {
    const {output} = await matchmakingPrompt({
        ...input,
        // @ts-ignore - The prompt template can handle the array of objects
        artisans,
        products
    });
    return output!;
  }
);

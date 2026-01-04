'use server';

/**
 * @fileOverview A flow for generating draft responses to alerts using AI.
 *
 * - generateDraftResponse - A function that generates a draft response for a given alert.
 * - GenerateDraftResponseInput - The input type for the generateDraftResponse function.
 * - GenerateDraftResponseOutput - The return type for the generateDraftResponse function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDraftResponseInputSchema = z.object({
  alertTitle: z.string().describe('The title of the alert.'),
  alertSnippet: z.string().describe('A short snippet from the alert content.'),
  alertSource: z.string().describe('The source of the alert (e.g., news website).'),
  userKeywords: z.array(z.string()).optional().describe('Keywords provided by the user to focus the response.'),
});
export type GenerateDraftResponseInput = z.infer<typeof GenerateDraftResponseInputSchema>;

const GenerateDraftResponseOutputSchema = z.object({
  draftResponse: z.string().describe('A draft response to the alert.'),
});
export type GenerateDraftResponseOutput = z.infer<typeof GenerateDraftResponseOutputSchema>;

export async function generateDraftResponse(input: GenerateDraftResponseInput): Promise<GenerateDraftResponseOutput> {
  return generateDraftResponseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'draftResponsePrompt',
  input: {schema: GenerateDraftResponseInputSchema},
  output: {schema: GenerateDraftResponseOutputSchema},
  prompt: `You are an AI assistant tasked with drafting a short response to a Google Alert.

  Given the following information from the alert, generate a draft response:

  Title: {{{alertTitle}}}
  Snippet: {{{alertSnippet}}}
  Source: {{{alertSource}}}
  {{#if userKeywords}}
  The user has provided the following keywords to guide the response:
  {{#each userKeywords}}
  - {{{this}}}
  {{/each}}
  {{\if}}

  Draft Response:`, 
});

const generateDraftResponseFlow = ai.defineFlow(
  {
    name: 'generateDraftResponseFlow',
    inputSchema: GenerateDraftResponseInputSchema,
    outputSchema: GenerateDraftResponseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

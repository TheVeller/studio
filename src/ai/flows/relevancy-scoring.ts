'use server';

/**
 * @fileOverview A relevancy scoring AI agent.
 *
 * - scoreRelevancy - A function that scores the relevancy of an alert.
 * - ScoreRelevancyInput - The input type for the scoreRelevancy function.
 * - ScoreRelevancyOutput - The return type for the scoreRelevancy function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ScoreRelevancyInputSchema = z.object({
  title: z.string().describe('The title of the alert.'),
  snippet: z.string().describe('The snippet of the alert.'),
  keywords: z.array(z.string()).describe('The keywords to check for relevancy.'),
});
export type ScoreRelevancyInput = z.infer<typeof ScoreRelevancyInputSchema>;

const ScoreRelevancyOutputSchema = z.object({
  relevancyScore: z.number().describe('The relevancy score of the alert, from 0 to 1.'),
  reason: z.string().describe('The reason for the relevancy score.'),
});
export type ScoreRelevancyOutput = z.infer<typeof ScoreRelevancyOutputSchema>;

export async function scoreRelevancy(input: ScoreRelevancyInput): Promise<ScoreRelevancyOutput> {
  return scoreRelevancyFlow(input);
}

const relevancyPrompt = ai.definePrompt({
  name: 'relevancyPrompt',
  input: {schema: ScoreRelevancyInputSchema},
  output: {schema: ScoreRelevancyOutputSchema},
  prompt: `You are an AI expert at scoring the relevancy of alerts based on keywords and context.

  Score the relevancy of the alert based on the following information:

  Title: {{{title}}}
  Snippet: {{{snippet}}}
  Keywords: {{{keywords}}}

  Provide a relevancy score from 0 to 1, and a reason for the score.
  `,
});

const scoreRelevancyFlow = ai.defineFlow(
  {
    name: 'scoreRelevancyFlow',
    inputSchema: ScoreRelevancyInputSchema,
    outputSchema: ScoreRelevancyOutputSchema,
  },
  async input => {
    const {output} = await relevancyPrompt(input);
    return output!;
  }
);

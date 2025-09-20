'use server';
/**
 * @fileOverview Predicts the future relevance of a given skill or job.
 *
 * - predictFutureSkillRelevance - A function that predicts the future relevance of a given skill or job.
 * - PredictFutureSkillRelevanceInput - The input type for the predictFutureSkillRelevance function.
 * - PredictFutureSkillRelevanceOutput - The return type for the predictFutureSkillRelevance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictFutureSkillRelevanceInputSchema = z.object({
  skillOrJob: z.string().describe('The skill or job to predict the future relevance of.'),
  yearsInFuture: z
    .number()
    .min(1)
    .max(10)
    .describe('The number of years into the future to predict relevance for.'),
});
export type PredictFutureSkillRelevanceInput = z.infer<
  typeof PredictFutureSkillRelevanceInputSchema
>;

const PredictFutureSkillRelevanceOutputSchema = z.object({
  relevanceScore: z
    .number()
    .min(0)
    .max(100)
    .describe('A score from 0 to 100 representing the predicted relevance.'),
  reasoning: z.string().describe('The AI reasoning behind the relevance score.'),
});
export type PredictFutureSkillRelevanceOutput = z.infer<
  typeof PredictFutureSkillRelevanceOutputSchema
>;

export async function predictFutureSkillRelevance(
  input: PredictFutureSkillRelevanceInput
): Promise<PredictFutureSkillRelevanceOutput> {
  return predictFutureSkillRelevanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictFutureSkillRelevancePrompt',
  input: {schema: PredictFutureSkillRelevanceInputSchema},
  output: {schema: PredictFutureSkillRelevanceOutputSchema},
  prompt: `You are an AI career advisor. You are tasked with predicting how relevant a skill or job will be in the future.

  Skill/Job: {{{skillOrJob}}}
  Years in Future: {{{yearsInFuture}}}

  Provide a relevanceScore (0-100) and reasoning for your prediction.

  Relevance Score: 
  Reasoning: `,
});

const predictFutureSkillRelevanceFlow = ai.defineFlow(
  {
    name: 'predictFutureSkillRelevanceFlow',
    inputSchema: PredictFutureSkillRelevanceInputSchema,
    outputSchema: PredictFutureSkillRelevanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

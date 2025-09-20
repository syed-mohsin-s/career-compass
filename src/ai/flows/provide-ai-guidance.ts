// src/ai/flows/provide-ai-guidance.ts
'use server';

/**
 * @fileOverview An AI mentor/guide flow that provides personalized career guidance.
 *
 * - provideAIGuidance - A function that takes a user's query and returns AI-generated guidance.
 * - ProvideAIGuidanceInput - The input type for the provideAIGuidance function.
 * - ProvideAIGuidanceOutput - The return type for the provideAIGuidance function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAIGuidanceInputSchema = z.object({
  query: z.string().describe('The user\u2019s question or request for guidance.'),
  skillProfile: z.string().optional().describe('The user\u2019s skill profile information (skills, education, interests, work experience).'),
});
export type ProvideAIGuidanceInput = z.infer<typeof ProvideAIGuidanceInputSchema>;

const ProvideAIGuidanceOutputSchema = z.object({
  guidance: z.string().describe('The AI-generated guidance for the user.'),
});
export type ProvideAIGuidanceOutput = z.infer<typeof ProvideAIGuidanceOutputSchema>;

export async function provideAIGuidance(input: ProvideAIGuidanceInput): Promise<ProvideAIGuidanceOutput> {
  return provideAIGuidanceFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAIGuidancePrompt',
  input: {schema: ProvideAIGuidanceInputSchema},
  output: {schema: ProvideAIGuidanceOutputSchema},
  prompt: `You are an AI career mentor/guide. Your role is to provide personalized guidance and support to users on their career journey.

  The user has provided the following query: {{{query}}}
  {{#if skillProfile}}
  Here is the user's skill profile:
  {{skillProfile}}
  {{/if}}
  Provide helpful and encouraging guidance based on the query and skill profile, if provided.
  Be concise and actionable.`,
});

const provideAIGuidanceFlow = ai.defineFlow(
  {
    name: 'provideAIGuidanceFlow',
    inputSchema: ProvideAIGuidanceInputSchema,
    outputSchema: ProvideAIGuidanceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

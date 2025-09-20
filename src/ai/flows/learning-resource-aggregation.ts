'use server';

/**
 * @fileOverview This file defines a Genkit flow for aggregating learning resources.
 *
 * The flow takes a skill gap analysis as input and returns a list of relevant learning resources.
 *
 * @fileOverview
 * - learningResourceAggregation - A function that aggregates learning resources based on skill gaps.
 * - LearningResourceAggregationInput - The input type for the learningResourceAggregation function.
 * - LearningResourceAggregationOutput - The return type for the learningResourceAggregation function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearningResourceSchema = z.object({
  title: z.string().describe('The title of the learning resource.'),
  url: z.string().url().describe('The URL of the learning resource.'),
  type: z.string().describe('The type of learning resource (e.g., course, video, article).'),
  provider: z.string().describe('The provider of the learning resource (e.g., Coursera, YouTube).'),
  estimatedDuration: z
    .string()
    .describe('The estimated time to complete the learning resource (e.g., 2 hours, 1 week).'),
});

const LearningResourceAggregationInputSchema = z.object({
  skillGaps: z
    .string()
    .describe(
      'A comma separated list of skill gaps identified from the user\'s profile compared to the requirements of the career path.'
    ),
});
export type LearningResourceAggregationInput = z.infer<
  typeof LearningResourceAggregationInputSchema
>;

const LearningResourceAggregationOutputSchema = z.object({
  learningResources: z
    .array(LearningResourceSchema)
    .describe('A list of relevant learning resources for the identified skill gaps.'),
});
export type LearningResourceAggregationOutput = z.infer<
  typeof LearningResourceAggregationOutputSchema
>;

export async function learningResourceAggregation(
  input: LearningResourceAggregationInput
): Promise<LearningResourceAggregationOutput> {
  return learningResourceAggregationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'learningResourceAggregationPrompt',
  input: {schema: LearningResourceAggregationInputSchema},
  output: {schema: LearningResourceAggregationOutputSchema},
  prompt: `You are an AI learning resource aggregator. Your role is to find relevant learning resources based on the user's skill gaps.

  Given the following skill gaps:
  {{skillGaps}}

  Find a list of learning resources that can help the user upskill in these areas. The learning resources should include the title, URL, type, provider, and estimated duration.
  Each resource should be highly relevant to the listed skill gaps.
  Please provide learning resources with the following fields:
  * title: the title of the learning resource
  * url: the URL of the learning resource
  * type: the type of learning resource (e.g., course, video, article)
  * provider: the provider of the learning resource (e.g., Coursera, YouTube)
  * estimatedDuration: the estimated time to complete the learning resource (e.g., 2 hours, 1 week).
  `,
});

const learningResourceAggregationFlow = ai.defineFlow(
  {
    name: 'learningResourceAggregationFlow',
    inputSchema: LearningResourceAggregationInputSchema,
    outputSchema: LearningResourceAggregationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

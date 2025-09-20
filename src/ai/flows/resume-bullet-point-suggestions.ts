// src/ai/flows/resume-bullet-point-suggestions.ts
'use server';

/**
 * @fileOverview Provides AI-generated suggestions for resume bullet points based on user profile and job description.
 *
 * - resumeBulletPointSuggestions - A function that provides resume bullet point suggestions.
 * - ResumeBulletPointSuggestionsInput - The input type for the resumeBulletPointSuggestions function.
 * - ResumeBulletPointSuggestionsOutput - The return type for the resumeBulletPointSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ResumeBulletPointSuggestionsInputSchema = z.object({
  profileSummary: z
    .string()
    .describe('A summary of the user profile, including skills, education, and experience.'),
  jobDescription: z
    .string()
    .describe('The job description for the desired role.'),
  existingBulletPoints: z
    .array(z.string())
    .optional()
    .describe('Existing bullet points in the resume, if any.'),
});
export type ResumeBulletPointSuggestionsInput = z.infer<
  typeof ResumeBulletPointSuggestionsInputSchema
>;

const ResumeBulletPointSuggestionsOutputSchema = z.object({
  suggestedBulletPoints: z
    .array(z.string())
    .describe('AI-generated suggestions for resume bullet points.'),
  improvements: z
    .array(z.string())
    .optional()
    .describe('Suggestions for improving existing bullet points.'),
});
export type ResumeBulletPointSuggestionsOutput = z.infer<
  typeof ResumeBulletPointSuggestionsOutputSchema
>;

export async function resumeBulletPointSuggestions(
  input: ResumeBulletPointSuggestionsInput
): Promise<ResumeBulletPointSuggestionsOutput> {
  return resumeBulletPointSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'resumeBulletPointSuggestionsPrompt',
  input: {schema: ResumeBulletPointSuggestionsInputSchema},
  output: {schema: ResumeBulletPointSuggestionsOutputSchema},
  prompt: `You are an expert resume writer. Your goal is to provide compelling bullet points for a user's resume based on their profile summary and the job description they are targeting.

Here is the user's profile summary:
{{{profileSummary}}}

Here is the job description:
{{{jobDescription}}}

{{#if existingBulletPoints}}
Here are the user's existing bullet points:
{{#each existingBulletPoints}}
* {{{this}}}
{{/each}}

Provide suggestions for improving the existing bullet points.
{{/if}}

Suggest new bullet points that highlight the user's qualifications for the job.

New Bullet Point Suggestions:
Improvements:
`,
});

const resumeBulletPointSuggestionsFlow = ai.defineFlow(
  {
    name: 'resumeBulletPointSuggestionsFlow',
    inputSchema: ResumeBulletPointSuggestionsInputSchema,
    outputSchema: ResumeBulletPointSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

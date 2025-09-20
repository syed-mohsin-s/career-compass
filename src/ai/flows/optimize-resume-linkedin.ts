'use server';

/**
 * @fileOverview Optimizes a resume and LinkedIn profile to improve chances of getting noticed by recruiters.
 *
 * - optimizeResumeAndLinkedIn - A function that optimizes a resume and LinkedIn profile.
 * - OptimizeResumeAndLinkedInInput - The input type for the optimizeResumeAndLinkedIn function.
 * - OptimizeResumeAndLinkedInOutput - The return type for the optimizeResumeAndLinkedIn function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const OptimizeResumeAndLinkedInInputSchema = z.object({
  resume: z
    .string()
    .describe('The user\'s resume in plain text format.'),
  linkedInProfile: z
    .string()
    .describe('The user\'s LinkedIn profile in plain text format.'),
  jobDescription: z
    .string()
    .describe('The job description for the desired role.'),
});
export type OptimizeResumeAndLinkedInInput = z.infer<typeof OptimizeResumeAndLinkedInInputSchema>;

const OptimizeResumeAndLinkedInOutputSchema = z.object({
  optimizedResume: z
    .string()
    .describe('The optimized resume in plain text format.'),
  optimizedLinkedInProfile: z
    .string()
    .describe('The optimized LinkedIn profile in plain text format.'),
  suggestions: z.array(z.string()).describe('A list of suggestions for further improvement.'),
});
export type OptimizeResumeAndLinkedInOutput = z.infer<typeof OptimizeResumeAndLinkedInOutputSchema>;

export async function optimizeResumeAndLinkedIn(
  input: OptimizeResumeAndLinkedInInput
): Promise<OptimizeResumeAndLinkedInOutput> {
  return optimizeResumeAndLinkedInFlow(input);
}

const prompt = ai.definePrompt({
  name: 'optimizeResumeAndLinkedInPrompt',
  input: {schema: OptimizeResumeAndLinkedInInputSchema},
  output: {schema: OptimizeResumeAndLinkedInOutputSchema},
  prompt: `You are an expert career coach specializing in resume and LinkedIn profile optimization.

You will receive a resume, a LinkedIn profile, and a job description. Your goal is to optimize both the resume and the LinkedIn profile to increase the user's chances of getting noticed by recruiters for the specified job.

Provide the optimized resume and LinkedIn profile, as well as a list of suggestions for further improvement.

Resume:
{{{resume}}}

LinkedIn Profile:
{{{linkedInProfile}}}

Job Description:
{{{jobDescription}}}

Optimized Resume:
Optimized LinkedIn Profile:
Suggestions:`, // Ensure that the output is structured correctly for parsing.
});

const optimizeResumeAndLinkedInFlow = ai.defineFlow(
  {
    name: 'optimizeResumeAndLinkedInFlow',
    inputSchema: OptimizeResumeAndLinkedInInputSchema,
    outputSchema: OptimizeResumeAndLinkedInOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

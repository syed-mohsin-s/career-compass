'use server';

/**
 * @fileOverview A career path suggestion AI agent.
 *
 * - suggestCareerPaths - A function that suggests career paths based on a skill profile.
 * - SuggestCareerPathsInput - The input type for the suggestCareerPaths function.
 * - SuggestCareerPathsOutput - The return type for the suggestCareerPaths function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestCareerPathsInputSchema = z.object({
  skills: z
    .string()
    .describe('A comma separated list of skills the user possesses.'),
  education: z.string().describe('The education level of the user.'),
  interests: z.string().describe('A comma separated list of the user interests.'),
  experience: z.string().describe('Description of the user work experience.'),
  goal: z.string().describe('The user\'s primary career goal.'),
});
export type SuggestCareerPathsInput = z.infer<typeof SuggestCareerPathsInputSchema>;

const SuggestCareerPathsOutputSchema = z.object({
  careerPaths: z
    .array(z.string())
    .describe('An array of 3-5 possible career paths based on the user\s skill profile.'),
});
export type SuggestCareerPathsOutput = z.infer<typeof SuggestCareerPathsOutputSchema>;

export async function suggestCareerPaths(input: SuggestCareerPathsInput): Promise<SuggestCareerPathsOutput> {
  return suggestCareerPathsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestCareerPathsPrompt',
  input: {schema: SuggestCareerPathsInputSchema},
  output: {schema: SuggestCareerPathsOutputSchema},
  prompt: `You are a career counselor who suggests possible career paths based on a user's skill profile and goals.

  Suggest 3-5 possible career paths based on the following information:

  Skills: {{{skills}}}
  Education: {{{education}}}
  Interests: {{{interests}}}
  Experience: {{{experience}}}
  Career Goal: {{{goal}}}

  The career paths should align with the user's stated goal.

  Format the output as a JSON array of strings.`,
});

const suggestCareerPathsFlow = ai.defineFlow(
  {
    name: 'suggestCareerPathsFlow',
    inputSchema: SuggestCareerPathsInputSchema,
    outputSchema: SuggestCareerPathsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

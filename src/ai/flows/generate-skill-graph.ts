'use server';

/**
 * @fileOverview Skill Graph Generator.
 *
 * This file defines a Genkit flow for automatically generating a Skill Graph
 * from a user's skills, education, interests, and work experience.
 *
 * @fileOverview
 * - `generateSkillGraph`: The main function to generate the skill graph.
 * - `GenerateSkillGraphInput`: Input type for the `generateSkillGraph` function.
 * - `GenerateSkillGraphOutput`: Output type for the `generateSkillGraph` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

/**
 * Input schema for the skill graph generation.
 */
const GenerateSkillGraphInputSchema = z.object({
  skills: z.array(z.string()).describe('List of skills.'),
  education: z.string().describe('User education details.'),
  interests: z.string().describe('User interests.'),
  workExperience: z.string().describe('User work experience details.'),
});

export type GenerateSkillGraphInput = z.infer<
  typeof GenerateSkillGraphInputSchema
>;

/**
 * Output schema for the skill graph generation.
 */
const GenerateSkillGraphOutputSchema = z.object({
  skillGraphData: z
    .string()
    .describe(
      'A string representation of the skill graph data, such as JSON or GraphML format.'
    ),
});

export type GenerateSkillGraphOutput = z.infer<
  typeof GenerateSkillGraphOutputSchema
>;

/**
 * Main function to generate the skill graph.
 * @param input - Input data containing skills, education, interests, and work experience.
 * @returns A promise that resolves to the generated skill graph data.
 */
export async function generateSkillGraph(
  input: GenerateSkillGraphInput
): Promise<GenerateSkillGraphOutput> {
  return generateSkillGraphFlow(input);
}

const generateSkillGraphPrompt = ai.definePrompt({
  name: 'generateSkillGraphPrompt',
  input: {schema: GenerateSkillGraphInputSchema},
  output: {schema: GenerateSkillGraphOutputSchema},
  prompt: `You are an AI expert in career skills and visualizations.

  Based on the following information about a user, generate a skill graph that
  visualizes the relationships between their skills, education, interests, and
  work experience.

  Skills: {{{skills}}}
  Education: {{{education}}}
  Interests: {{{interests}}}
  Work Experience: {{{workExperience}}}

  The output should be a string representation of the skill graph data, such as JSON or GraphML format.
  Ensure that the generated graph data is valid and can be easily parsed by a graph visualization library.
  Return only the skill graph data. No other explanation is needed.
  `,
});

const generateSkillGraphFlow = ai.defineFlow(
  {
    name: 'generateSkillGraphFlow',
    inputSchema: GenerateSkillGraphInputSchema,
    outputSchema: GenerateSkillGraphOutputSchema,
  },
  async input => {
    const {output} = await generateSkillGraphPrompt(input);
    return output!;
  }
);

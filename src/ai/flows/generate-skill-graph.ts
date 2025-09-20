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
const SkillGraphNodeSchema = z.object({
  subject: z.string(),
  value: z.number(),
  maxValue: z.number(),
});

const GenerateSkillGraphOutputSchema = z.object({
  skillGraphData: z
    .array(SkillGraphNodeSchema)
    .describe(
      'An array of objects representing the skill graph data. Each object should have a subject (skill name), a value (proficiency), and a maxValue.'
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

  The output should be a JSON array of objects. Each object should contain:
  - "subject": The name of a skill category or a specific skill.
  - "value": A score from 0-100 representing the user's estimated proficiency based on the provided info.
  - "maxValue": The maximum value for the score, which should always be 100.
  
  Generate between 5 and 7 subjects for the graph.
  Return only the JSON data. No other explanation is needed.
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

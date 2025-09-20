'use server';

/**
 * @fileOverview Job Skill Graph Generator.
 *
 * This file defines a Genkit flow for automatically generating a Skill Graph
 * for a specific job role.
 *
 * @fileOverview
 * - `generateJobSkillGraph`: The main function to generate the skill graph for a job.
 * - `GenerateJobSkillGraphInput`: Input type for the `generateJobSkillGraph` function.
 * - `GenerateJobSkillGraphOutput`: Output type for the `generateJobSkillGraph` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateJobSkillGraphInputSchema = z.object({
  jobRole: z.string().describe('The job role to generate a skill graph for.'),
});
export type GenerateJobSkillGraphInput = z.infer<typeof GenerateJobSkillGraphInputSchema>;


const SkillGraphNodeSchema = z.object({
  subject: z.string(),
  value: z.number(),
  maxValue: z.number(),
});

const GenerateJobSkillGraphOutputSchema = z.object({
  skillGraphData: z
    .array(SkillGraphNodeSchema)
    .describe(
      'An array of objects representing the skill graph data. Each object should have a subject (skill name), a value (proficiency), and a maxValue.'
    ),
});


export type GenerateJobSkillGraphOutput = z.infer<
  typeof GenerateJobSkillGraphOutputSchema
>;

/**
 * Main function to generate the skill graph for a job role.
 * @param input - Input data containing the job role.
 * @returns A promise that resolves to the generated skill graph data.
 */
export async function generateJobSkillGraph(
  input: GenerateJobSkillGraphInput
): Promise<GenerateJobSkillGraphOutput> {
  return generateJobSkillGraphFlow(input);
}

const generateJobSkillGraphPrompt = ai.definePrompt({
  name: 'generateJobSkillGraphPrompt',
  input: {schema: GenerateJobSkillGraphInputSchema},
  output: {schema: GenerateJobSkillGraphOutputSchema},
  prompt: `You are an AI expert in career skills and job requirements.

  Based on the following job role, generate a skill graph that visualizes the
  key skills required for this position.

  Job Role: {{{jobRole}}}

  The output should be a JSON array of objects. Each object should contain:
  - "subject": The name of a key skill or skill category.
  - "value": A score from 0-100 representing the importance of this skill for the role.
  - "maxValue": The maximum value for the score, which should always be 100.
  
  Generate between 5 and 7 subjects for the graph.
  Return only the JSON data. No other explanation is needed.
  `,
});

const generateJobSkillGraphFlow = ai.defineFlow(
  {
    name: 'generateJobSkillGraphFlow',
    inputSchema: GenerateJobSkillGraphInputSchema,
    outputSchema: GenerateJobSkillGraphOutputSchema,
  },
  async input => {
    const {output} = await generateJobSkillGraphPrompt(input);
    return output!;
  }
);

'use server';

/**
 * @fileOverview Analyzes a user's skills for pros, cons, and future-proofing.
 *
 * - analyzeSkills - A function that analyzes a user's skills.
 * - AnalyzeSkillsInput - The input type for the analyzeSkills function.
 * - AnalyzeSkillsOutput - The return type for the analyzeSkills function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnalyzeSkillsInputSchema = z.object({
  skills: z.string().describe("A comma-separated list of the user's skills."),
});
export type AnalyzeSkillsInput = z.infer<typeof AnalyzeSkillsInputSchema>;

const SkillFutureProofnessSchema = z.object({
  skill: z.string().describe('The name of the skill.'),
  relevanceScore: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'A score from 0 to 100 representing the predicted future relevance of the skill.'
    ),
  reasoning: z
    .string()
    .describe('The reasoning behind the relevance score.'),
});

const AnalyzeSkillsOutputSchema = z.object({
  pros: z
    .array(z.string())
    .describe("A list of strengths/pros of the user's current skill set."),
  cons: z
    .array(z.string())
    .describe("A list of weaknesses/cons of the user's current skill set."),
  futureProofSkills: z
    .array(SkillFutureProofnessSchema)
    .describe(
      'An array of individual skills with their future-proof scores and reasoning.'
    ),
  overallFutureProofIndex: z
    .number()
    .min(0)
    .max(100)
    .describe(
      'An overall score from 0 to 100 representing how future-proof the entire skill set is.'
    ),
});
export type AnalyzeSkillsOutput = z.infer<typeof AnalyzeSkillsOutputSchema>;

export async function analyzeSkills(
  input: AnalyzeSkillsInput
): Promise<AnalyzeSkillsOutput> {
  return analyzeSkillsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'analyzeSkillsPrompt',
  input: {schema: AnalyzeSkillsInputSchema},
  output: {schema: AnalyzeSkillsOutputSchema},
  prompt: `You are an expert career analyst. Based on the following comma-separated list of skills, provide an analysis.

Skills: {{{skills}}}

Your analysis should include:
- A list of pros/strengths for this skill set.
- A list of cons/weaknesses for this skill set.
- For each skill, provide a future-proof analysis including:
  - "skill": The name of the skill.
  - "relevanceScore": A score between 0 and 100 for its future relevance.
  - "reasoning": A brief explanation for the score.
- An "overallFutureProofIndex" score between 0 and 100, which is the average of the individual skill scores.

Provide a concise analysis with 2-3 points for pros and cons.
`,
});

const analyzeSkillsFlow = ai.defineFlow(
  {
    name: 'analyzeSkillsFlow',
    inputSchema: AnalyzeSkillsInputSchema,
    outputSchema: AnalyzeSkillsOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);
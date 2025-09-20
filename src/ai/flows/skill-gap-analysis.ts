// src/ai/flows/skill-gap-analysis.ts
'use server';

/**
 * @fileOverview Analyzes skill gaps between a user's profile and a target career path.
 *
 * This flow takes a user's skill profile and a target career path as input,
 * and identifies the skills the user needs to acquire to be successful in that career path.
 *
 * @fileOverview
 * - skillGapAnalysis - A function that analyzes skill gaps.
 * - SkillGapAnalysisInput - The input type for the skillGapAnalysis function.
 * - SkillGapAnalysisOutput - The return type for the skillGapAnalysis function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SkillGapAnalysisInputSchema = z.object({
  skillProfile: z
    .string()
    .describe('A summary of the user’s current skills, education, interests, and work experience.'),
  careerPath: z.string().describe('The target career path to analyze skill gaps for.'),
});
export type SkillGapAnalysisInput = z.infer<typeof SkillGapAnalysisInputSchema>;

const SkillGapAnalysisOutputSchema = z.object({
  missingSkills: z
    .string()
    .describe(
      'A comma-separated list of skills the user needs to acquire for the specified career path.'
    ),
  reasoning: z
    .string()
    .describe('The AI reasoning behind the identified skill gaps.'),
});
export type SkillGapAnalysisOutput = z.infer<typeof SkillGapAnalysisOutputSchema>;

export async function skillGapAnalysis(input: SkillGapAnalysisInput): Promise<SkillGapAnalysisOutput> {
  return skillGapAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'skillGapAnalysisPrompt',
  input: {schema: SkillGapAnalysisInputSchema},
  output: {schema: SkillGapAnalysisOutputSchema},
  prompt: `You are a career advisor. A user wants to identify the skills they need to acquire for a specific career path.

  Based on the user's skill profile and the target career path, identify the skills the user needs to acquire.

  User Skill Profile: {{{skillProfile}}}
  Target Career Path: {{{careerPath}}}

  Missing Skills (comma-separated):
  Reasoning:
  `,
});

const skillGapAnalysisFlow = ai.defineFlow(
  {
    name: 'skillGapAnalysisFlow',
    inputSchema: SkillGapAnalysisInputSchema,
    outputSchema: SkillGapAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

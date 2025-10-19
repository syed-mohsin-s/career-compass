'use server';
/**
 * @fileOverview Predicts the salary range for a given job role.
 *
 * - predictSalaryRange - A function that predicts the salary range for a given job role.
 * - PredictSalaryRangeInput - The input type for the predictSalaryRange function.
 * - PredictSalaryRangeOutput - The return type for the predictSalaryRange function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PredictSalaryRangeInputSchema = z.object({
  jobRole: z.string().describe('The job role to predict the salary range for.'),
});
export type PredictSalaryRangeInput = z.infer<
  typeof PredictSalaryRangeInputSchema
>;

const PredictSalaryRangeOutputSchema = z.object({
  salaryRange: z
    .string()
    .describe('The predicted salary range for the job role (e.g., $120K - $180K).'),
});
export type PredictSalaryRangeOutput = z.infer<
  typeof PredictSalaryRangeOutputSchema
>;

export async function predictSalaryRange(
  input: PredictSalaryRangeInput
): Promise<PredictSalaryRangeOutput> {
  return predictSalaryRangeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'predictSalaryRangePrompt',
  input: {schema: PredictSalaryRangeInputSchema},
  output: {schema: PredictSalaryRangeOutputSchema},
  prompt: `You are an AI career advisor. You are tasked with predicting the salary range for a given job role.

  Job Role: {{{jobRole}}}

  Provide a salary range for this role.

  Salary Range: `,
});

const predictSalaryRangeFlow = ai.defineFlow(
  {
    name: 'predictSalaryRangeFlow',
    inputSchema: PredictSalaryRangeInputSchema,
    outputSchema: PredictSalaryRangeOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

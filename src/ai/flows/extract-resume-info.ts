
'use server';

/**
 * @fileOverview Extracts structured information from a resume.
 *
 * - extractResumeInfo - A function that parses a resume and extracts key information.
 * - ExtractResumeInfoInput - The input type for the extractResumeInfo function.
 * - ExtractResumeInfoOutput - The return type for the extractResumeInfo function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExtractResumeInfoInputSchema = z.object({
  resumeDataUri: z
    .string()
    .describe(
      "A user's resume, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type ExtractResumeInfoInput = z.infer<typeof ExtractResumeInfoInputSchema>;

const ExtractResumeInfoOutputSchema = z.object({
  skills: z.string().describe("A comma-separated list of the user's skills extracted from the resume."),
  education: z.string().describe("The user's education extracted from the resume."),
  experience: z.string().describe("The user's work experience extracted from the resume."),
});
export type ExtractResumeInfoOutput = z.infer<typeof ExtractResumeInfoOutputSchema>;

export async function extractResumeInfo(input: ExtractResumeInfoInput): Promise<ExtractResumeInfoOutput> {
  return extractResumeInfoFlow(input);
}

const prompt = ai.definePrompt({
  name: 'extractResumeInfoPrompt',
  input: {schema: ExtractResumeInfoInputSchema},
  output: {schema: ExtractResumeInfoOutputSchema},
  prompt: `You are an expert resume parser. Your task is to extract key information from the provided resume.

  Resume:
  {{media url=resumeDataUri}}

  Extract the following information:
  - Skills: A comma-separated list of skills.
  - Education: A summary of the user's education.
  - Work Experience: A summary of the user's work experience.
  
  Provide only the extracted information in the correct JSON format.`,
});

const extractResumeInfoFlow = ai.defineFlow(
  {
    name: 'extractResumeInfoFlow',
    inputSchema: ExtractResumeInfoInputSchema,
    outputSchema: ExtractResumeInfoOutputSchema,
  },
  async (input) => {
    const {output} = await prompt(input);
    return output!;
  }
);

'use server';
/**
 * @fileOverview An AI interviewer agent.
 *
 * - provideAiMockInterviews - A function that provides mock interview experience.
 * - ProvideAiMockInterviewsInput - The input type for the provideAiMockInterviews function.
 * - ProvideAiMockInterviewsOutput - The return type for the provideAiMockInterviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAiMockInterviewsInputSchema = z.object({
  resume: z
    .string()
    .describe(
      'The resume of the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: \'data:<mimetype>;base64,<encoded_data>\'.' // Ensuring correct data URI format.
    ),
  jobDescription: z.string().describe('The job description for which the user is interviewing.'),
  userResponse: z.string().describe('The user\'s response to the interviewer\'s question.'),
  interviewerQuestion: z.string().optional().describe('The interviewer\'s question.'),
});
export type ProvideAiMockInterviewsInput = z.infer<typeof ProvideAiMockInterviewsInputSchema>;

const ProvideAiMockInterviewsOutputSchema = z.object({
  interviewerResponse: z.string().describe('The interviewer\'s response to the user\'s answer.'),
});
export type ProvideAiMockInterviewsOutput = z.infer<typeof ProvideAiMockInterviewsOutputSchema>;

export async function provideAiMockInterviews(input: ProvideAiMockInterviewsInput): Promise<ProvideAiMockInterviewsOutput> {
  return provideAiMockInterviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAiMockInterviewsPrompt',
  input: {schema: ProvideAiMockInterviewsInputSchema},
  output: {schema: ProvideAiMockInterviewsOutputSchema},
  prompt: `You are an AI interviewer, skilled at conducting job interviews and providing constructive feedback.

  Here is the resume of the candidate: {{media url=resume}}

  Here is the job description for which the candidate is interviewing: {{{jobDescription}}}

  The previous interviewer question was: {{{interviewerQuestion}}}

  Here is the candidate\'s response to the interviewer\'s question: {{{userResponse}}}

  Based on the candidate\'s resume, the job description, the previous interviewer question, and the candidate\'s response, provide a response as the interviewer.
  If the user\'s response is not sufficient, ask a follow-up question. Otherwise, move on to the next topic.
  Each response should be no more than two sentences long.
  Format: [Interviewer]: <response here>
  `,
});

const provideAiMockInterviewsFlow = ai.defineFlow(
  {
    name: 'provideAiMockInterviewsFlow',
    inputSchema: ProvideAiMockInterviewsInputSchema,
    outputSchema: ProvideAiMockInterviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

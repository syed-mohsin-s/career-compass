'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating a personalized learning roadmap.
 *
 * The flow takes a career path and user's skill profile as input and returns a roadmap
 * with skills to learn and resources for learning them.
 *
 * @fileOverview
 * - generateLearningRoadmap - A function that generates personalized learning roadmaps.
 * - GenerateLearningRoadmapInput - The input type for the generateLearningRoadmap function.
 * - GenerateLearningRoadmapOutput - The return type for the generateLearningRoadmap function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const LearningResourceSchema = z.object({
  title: z.string().describe('The title of the learning resource.'),
  url: z.string().url().describe('The URL of the learning resource.'),
  type: z.string().describe('The type of learning resource (e.g., course, video, article).'),
  provider: z.string().describe('The provider of the learning resource (e.g., Coursera, YouTube).'),
  estimatedDuration: z
    .string()
    .describe('The estimated time to complete the learning resource (e.g., 2 hours, 1 week).'),
});

const LearningStepSchema = z.object({
  skill: z.string().describe('The skill to be learned.'),
  description: z.string().describe('A description of why this skill is important for the career path.'),
  resources: z.array(LearningResourceSchema).describe('A list of learning resources for the skill.'),
});

const GenerateLearningRoadmapInputSchema = z.object({
  careerPath: z
    .string()
    .describe('The chosen career path for which to generate a learning roadmap (e.g., Data Scientist).'),
  skillProfile: z
    .string()
    .describe(
      'A summary of the user’s current skills, education, interests, and work experience (e.g., proficient in Python, Bachelor’s in Computer Science).'
    ),
});
export type GenerateLearningRoadmapInput = z.infer<typeof GenerateLearningRoadmapInputSchema>;

const GenerateLearningRoadmapOutputSchema = z.object({
  roadmap: z.array(LearningStepSchema).describe('A personalized learning roadmap for the chosen career path.'),
  summary: z.string().describe('A summary of the generated learning roadmap.'),
});
export type GenerateLearningRoadmapOutput = z.infer<typeof GenerateLearningRoadmapOutputSchema>;

export async function generateLearningRoadmap(
  input: GenerateLearningRoadmapInput
): Promise<GenerateLearningRoadmapOutput> {
  return generateLearningRoadmapFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateLearningRoadmapPrompt',
  input: {schema: GenerateLearningRoadmapInputSchema},
  output: {schema: GenerateLearningRoadmapOutputSchema},
  prompt: `You are an AI career coach that generates personalized learning roadmaps for users based on their chosen career path and skill profile.

  Given the following career path:
  {{careerPath}}

  And the following skill profile:
  {{skillProfile}}

  Generate a learning roadmap with the necessary skills to learn, a description of why each skill is important for the career path, and a list of learning resources for each skill. The learning resources should include the title, URL, type, provider, and estimated duration.

  Please, provide a roadmap with learning steps. Each step should contain:
  * skill: the name of the skill to aquire
  * description: why it's important for the career path
  * resources: list of learning resources (title, URL, type, provider, estimatedDuration)
  Also, provide a short summary of the learning roadmap.
  `,
});

const generateLearningRoadmapFlow = ai.defineFlow(
  {
    name: 'generateLearningRoadmapFlow',
    inputSchema: GenerateLearningRoadmapInputSchema,
    outputSchema: GenerateLearningRoadmapOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);


import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import type { SuggestCareerPathsOutput } from '@/ai/flows/suggest-career-paths';
import type { GenerateSkillGraphOutput } from '@/ai/flows/generate-skill-graph';
import type { AnalyzeSkillsOutput } from '@/ai/flows/analyze-skills';

export interface UserProfile {
  skills: string;
  education: string;
  interests: string;
  experience: string;
  goal: string;
}

export type SkillGraphData = {
  subject: string;
  value: number;
  maxValue: number;
};


interface UserProfileState {
  profile?: UserProfile;
  careerPaths: SuggestCareerPathsOutput | null;
  learningPlan: (GenerateLearningRoadmapOutput & {roadmapTitle?: string}) | null;
  skillGraph: GenerateSkillGraphOutput | null;
  skillAnalysis: AnalyzeSkillsOutput | null;
  setProfile: (profile: UserProfile) => void;
  setCareerPaths: (paths: SuggestCareerPathsOutput | null) => void;
  setLearningPlan: (plan: (GenerateLearningRoadmapOutput & {roadmapTitle?: string}) | null) => void;
  setSkillGraph: (graph: GenerateSkillGraphOutput | null) => void;
  setSkillAnalysis: (analysis: AnalyzeSkillsOutput | null) => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profile: undefined,
      careerPaths: null,
      learningPlan: null,
      skillGraph: null,
      skillAnalysis: null,
      setProfile: (profile) => set({ profile }),
      setCareerPaths: (paths) => set({ careerPaths: paths }),
      setLearningPlan: (plan) => set({ learningPlan: plan }),
      setSkillGraph: (graph) => set({ skillGraph: graph }),
      setSkillAnalysis: (analysis) => set({ skillAnalysis: analysis }),
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

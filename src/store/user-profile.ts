import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { GenerateLearningRoadmapOutput } from '@/ai/flows/generate-learning-roadmap';
import type { SuggestCareerPathsOutput } from '@/ai/flows/suggest-career-paths';

export interface UserProfile {
  skills: string;
  education: string;
  interests: string;
  experience: string;
}

interface UserProfileState {
  profile: UserProfile;
  careerPaths: SuggestCareerPathsOutput | null;
  learningPlan: GenerateLearningRoadmapOutput | null;
  skillGraph: string | null;
  setProfile: (profile: UserProfile) => void;
  setCareerPaths: (paths: SuggestCareerPathsOutput | null) => void;
  setLearningPlan: (plan: GenerateLearningRoadmapOutput | null) => void;
  setSkillGraph: (graph: string | null) => void;
}

export const useUserProfileStore = create<UserProfileState>()(
  persist(
    (set) => ({
      profile: {
        skills: '',
        education: '',
        interests: '',
        experience: '',
      },
      careerPaths: null,
      learningPlan: null,
      skillGraph: null,
      setProfile: (profile) => set({ profile }),
      setCareerPaths: (paths) => set({ careerPaths: paths }),
      setLearningPlan: (plan) => set({ learningPlan: plan }),
      setSkillGraph: (graph) => set({ skillGraph: graph }),
    }),
    {
      name: 'user-profile-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);

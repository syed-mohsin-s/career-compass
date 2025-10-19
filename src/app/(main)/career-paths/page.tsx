"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, DollarSign, Loader2, Info } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";

import { useUserProfileStore } from "@/store/user-profile";
import useStore from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { predictFutureSkillRelevance } from "@/ai/flows/predict-future-skill-relevance";
import { generateLearningRoadmap } from "@/ai/flows/generate-learning-roadmap";
import { predictSalaryRange } from "@/ai/flows/predict-salary-range";

interface FutureProofIndex {
  score: number;
  loading: boolean;
}

interface SalaryPrediction {
    range: string;
    loading: boolean;
}

export default function CareerPathsPage() {
  const router = useRouter();
  const { toast } = useToast();
  
  const profile = useStore(useUserProfileStore, (state) => state.profile);
  const careerPaths = useStore(useUserProfileStore, (state) => state.careerPaths);
  const setLearningPlan = useUserProfileStore((state) => state.setLearningPlan);

  const [futureProofIndexes, setFutureProofIndexes] = useState<Record<string, FutureProofIndex>>({});
  const [salaryPredictions, setSalaryPredictions] = useState<Record<string, SalaryPrediction>>({});
  const [generatingPlan, setGeneratingPlan] = useState<string | null>(null);

  useEffect(() => {
    if (careerPaths?.careerPaths) {
      const initialIndexes: Record<string, FutureProofIndex> = {};
      const initialSalaries: Record<string, SalaryPrediction> = {};

      careerPaths.careerPaths.forEach(path => {
        initialIndexes[path] = { score: 0, loading: true };
        initialSalaries[path] = { range: 'N/A', loading: true };
      });

      setFutureProofIndexes(initialIndexes);
      setSalaryPredictions(initialSalaries);

      careerPaths.careerPaths.forEach(async (path) => {
        try {
          const [relevance, salary] = await Promise.all([
             predictFutureSkillRelevance({ skillOrJob: path, yearsInFuture: 5 }),
             predictSalaryRange({ jobRole: path }),
          ]);
          setFutureProofIndexes(prev => ({ ...prev, [path]: { score: relevance.relevanceScore, loading: false } }));
          setSalaryPredictions(prev => ({ ...prev, [path]: { range: salary.salaryRange, loading: false } }));
        } catch (error) {
          console.error(`Failed to fetch data for ${path}`, error);
          setFutureProofIndexes(prev => ({ ...prev, [path]: { score: 0, loading: false } }));
          setSalaryPredictions(prev => ({ ...prev, [path]: { range: "N/A", loading: false } }));
        }
      });
    }
  }, [careerPaths]);

  const handleGeneratePlan = async (careerPath: string) => {
    if (!profile || !profile.skills) {
       toast({ variant: "destructive", title: "Profile not found", description: "Please complete your skill profile first." });
       return;
    }
    setGeneratingPlan(careerPath);
    try {
        const skillProfileSummary = `Skills: ${profile.skills}. Education: ${profile.education}. Interests: ${profile.interests}. Experience: ${profile.experience}`;
        const plan = await generateLearningRoadmap({ careerPath, skillProfile: skillProfileSummary });
        setLearningPlan({...plan, roadmapTitle: careerPath});
        toast({ title: "Learning Plan Generated!", description: `Redirecting you to your plan for ${careerPath}.` });
        router.push('/learning-plan');
    } catch(error) {
        console.error("Failed to generate learning plan", error);
        toast({ variant: "destructive", title: "Generation Failed", description: "Could not generate a learning plan. Please try again." });
    } finally {
        setGeneratingPlan(null);
    }
  }

  if (careerPaths === undefined) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-24 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[300px] w-full" />
        </div>
      </div>
    );
  }

  if (!careerPaths || careerPaths.careerPaths.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-card border rounded-lg p-12">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="font-headline text-2xl font-bold">No Career Paths Found</h1>
        <p className="text-muted-foreground max-w-md mx-auto mt-2">
          We couldn't find any career path suggestions for you yet. Please complete your profile to get personalized recommendations.
        </p>
        <Button asChild className="mt-6">
          <Link href="/skill-profile">Complete Your Profile</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="bg-card border rounded-lg p-6">
        <h1 className="font-headline text-2xl font-bold">AI-Suggested Career Paths</h1>
        <p className="text-muted-foreground">
          Based on your profile, here are some career paths where you could excel.
        </p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {careerPaths.careerPaths.map((path) => (
          <Card key={path} className="flex flex-col">
            <CardHeader>
                <CardTitle className="font-headline text-xl">{path}</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 space-y-4">
               <div className="space-y-4">
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Future-Proof Index</h3>
                  {futureProofIndexes[path]?.loading ? (
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-4/5" />
                      <Skeleton className="h-6 w-3/5" />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <Progress value={futureProofIndexes[path]?.score || 0} className="w-[60%]" />
                      <span className="font-bold text-lg">{futureProofIndexes[path]?.score || 'N/A'}<span className="text-sm text-muted-foreground">/100</span></span>
                    </div>
                  )}
               </div>
                <div className="space-y-2">
                    <h3 className="text-sm font-semibold text-muted-foreground flex items-center gap-2"><DollarSign className="h-4 w-4" /> Estimated Salary</h3>
                    {salaryPredictions[path]?.loading ? (
                         <Skeleton className="h-6 w-1/2" />
                    ) : (
                        <p className="font-bold text-lg">{salaryPredictions[path]?.range || 'N/A'}</p>
                    )}
                </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" onClick={() => handleGeneratePlan(path)} disabled={generatingPlan === path}>
                {generatingPlan === path ? <Loader2 className="animate-spin" /> : "Generate Learning Plan"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

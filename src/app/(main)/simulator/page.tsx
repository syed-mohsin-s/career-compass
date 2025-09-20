"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FlaskConical, Zap, Briefcase, DollarSign, BarChart, Loader2 } from "lucide-react";

import { useUserProfileStore } from "@/store/user-profile";
import useStore from "@/hooks/use-store";
import { useToast } from "@/hooks/use-toast";
import { simulateNewSkillsImpact, SimulateNewSkillsImpactOutput } from "@/ai/flows/simulate-new-skills-impact";

export default function SimulatorPage() {
  const { toast } = useToast();
  const profile = useStore(useUserProfileStore, (state) => state.profile);
  const [newSkill, setNewSkill] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<SimulateNewSkillsImpactOutput | null>(null);

  const handleSimulate = async () => {
    if (!profile || !profile.skills) {
      toast({ variant: "destructive", title: "Profile Required", description: "Please complete your skill profile before using the simulator." });
      return;
    }
    if (!newSkill) {
      toast({ variant: "destructive", title: "Skill Required", description: "Please enter a skill to simulate." });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await simulateNewSkillsImpact({
        existingSkills: profile.skills,
        interests: profile.interests,
        workExperience: profile.experience,
        newSkill: newSkill,
      });
      setResult(response);
    } catch(error) {
      console.error(error);
      toast({ variant: "destructive", title: "Simulation Failed", description: "An error occurred. Please try again." });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-1">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <FlaskConical />
              What-If Simulator
            </CardTitle>
            <CardDescription>
              Add a hypothetical skill to see how it could reshape your career opportunities.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="new-skill">New Skill to Add</Label>
              <Input 
                id="new-skill" 
                placeholder="e.g., Generative AI, Cloud Security"
                value={newSkill}
                onChange={(e) => setNewSkill(e.target.value)}
              />
            </div>
            <Button className="w-full" onClick={handleSimulate} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
              Simulate Impact
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Simulation Results</CardTitle>
            <CardDescription>
                {result ? `Potential impact of adding '${newSkill}' to your skill profile.` : "Enter a skill and run the simulation to see results."}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {isLoading && (
                 <div className="flex flex-col items-center justify-center text-center p-8">
                    <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                    <h3 className="font-headline text-lg">Running Simulation...</h3>
                    <p className="text-muted-foreground">Analyzing potential career trajectories.</p>
                </div>
            )}
            {result && (
              <>
                <div className="grid gap-4 sm:grid-cols-2">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><Briefcase className="h-4 w-4" /> Potential New Jobs</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold font-headline">{result.potentialJobs || "N/A"}</p>
                        </CardContent>
                    </Card>
                     <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><DollarSign className="h-4 w-4" /> Estimated Salary Range</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-xl font-bold font-headline">{result.salaryRange || "N/A"}</p>
                        </CardContent>
                    </Card>
                </div>
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium flex items-center gap-2 text-muted-foreground"><BarChart className="h-4 w-4" /> Demand Impact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-muted-foreground">{result.demandImpact}</p>
                    </CardContent>
                </Card>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

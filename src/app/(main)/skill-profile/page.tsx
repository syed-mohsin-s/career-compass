
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GitGraph, Wand2, Loader2, TrendingUp, ThumbsUp, ThumbsDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileStore, type UserProfile } from "@/store/user-profile";
import { suggestCareerPaths } from "@/ai/flows/suggest-career-paths";
import { generateSkillGraph } from "@/ai/flows/generate-skill-graph";
import { analyzeSkills } from "@/ai/flows/analyze-skills";
import useStore from "@/hooks/use-store";

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Tooltip,
} from "recharts";
import { ChartContainer, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";

const profileSchema = z.object({
  skills: z.string().min(3, "Please enter at least one skill."),
  education: z.string().min(10, "Please provide more details about your education."),
  interests: z.string().min(3, "Please enter at least one interest."),
  experience: z.string().min(10, "Please provide more details about your work experience."),
});

const chartConfig = {
  value: {
    label: "Proficiency",
    color: "hsl(var(--primary))",
  },
} satisfies ChartConfig;

export default function SkillProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const storedProfile = useStore(useUserProfileStore, (state) => state.profile);
  const setProfile = useUserProfileStore((state) => state.setProfile);
  const setCareerPaths = useUserProfileStore((state) => state.setCareerPaths);
  const skillGraph = useStore(useUserProfileStore, (state) => state.skillGraph);
  const setSkillGraph = useUserProfileStore((state) => state.setSkillGraph);
  const skillAnalysis = useStore(useUserProfileStore, (state) => state.skillAnalysis);
  const setSkillAnalysis = useUserProfileStore((state) => state.setSkillAnalysis);


  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: storedProfile || {
      skills: "",
      education: "",
      interests: "",
      experience: "",
    },
    values: storedProfile || undefined, // ensures form is populated on mount
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    setProfile(values);
    try {
      const [pathsResult, graphResult, analysisResult] = await Promise.all([
        suggestCareerPaths({
          skills: values.skills,
          education: values.education,
          interests: values.interests,
          experience: values.experience,
        }),
        generateSkillGraph({
          skills: values.skills.split(",").map((s) => s.trim()),
          education: values.education,
          interests: values.interests,
          workExperience: values.experience,
        }),
        analyzeSkills({ skills: values.skills }),
      ]);
      
      setCareerPaths(pathsResult);
      setSkillGraph(graphResult);
      setSkillAnalysis(analysisResult);

      toast({
        title: "Profile Updated!",
        description: "Your career insights have been generated.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred.",
        description: "Failed to generate insights. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">Your Skill Profile</CardTitle>
                <CardDescription>
                  Provide your professional details to generate personalized career insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Python, TensorFlow, Project Management" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter your skills, separated by commas.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="education"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Education</FormLabel>
                      <FormControl>
                        <Textarea placeholder="e.g., B.S. in Computer Science, Stanford University" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="interests"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Interests</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Natural Language Processing, Open Source" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Work Experience</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Describe your key roles and accomplishments." className="min-h-[120px]" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Wand2 className="mr-2 h-4 w-4" />
                  )}
                  Update Profile & Generate Insights
                </Button>
              </CardContent>
            </form>
          </Form>
        </Card>
      </div>
      <div className="lg:col-span-2 space-y-6">
        <Card className="sticky top-20">
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <GitGraph />
              Your Skill Graph
            </CardTitle>
            <CardDescription>
              A visual representation of how your skills, experience, and interests connect.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-square bg-muted/50 rounded-lg flex items-center justify-center p-4 overflow-auto">
              {isLoading && !skillGraph && (
                 <div className="text-muted-foreground text-center">
                    <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                    <p>Generating your graph...</p>
                 </div>
              )}
              {!isLoading && !skillGraph && (
                <p className="text-muted-foreground text-center">
                  Update your profile to generate your Skill Graph.
                </p>
              )}
              {skillGraph && skillGraph.skillGraphData && (
                <ChartContainer
                  config={chartConfig}
                  className="mx-auto aspect-square h-full w-full"
                >
                  <RadarChart data={skillGraph.skillGraphData}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="subject" />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} />
                    <Radar
                      name="Skills"
                      dataKey="value"
                      stroke="hsl(var(--primary))"
                      fill="hsl(var(--primary))"
                      fillOpacity={0.6}
                    />
                     <Tooltip
                      content={({ active, payload }) => (
                        <ChartTooltipContent active={active} payload={payload} />
                      )}
                    />
                  </RadarChart>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
        {skillAnalysis && (
            <Card>
                <CardHeader>
                    <CardTitle className="font-headline">Skill Analysis</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div>
                        <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Future-Proof Index</h3>
                        <div className="flex items-center gap-2">
                            <Progress value={skillAnalysis.futureProofIndex || 0} className="w-[60%]" />
                            <span className="font-bold text-lg">{skillAnalysis.futureProofIndex || 'N/A'}<span className="text-sm text-muted-foreground">/100</span></span>
                        </div>
                    </div>
                    <Separator/>
                    <div className="space-y-4">
                        <div>
                             <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><ThumbsUp className="h-4 w-4" /> Pros</h3>
                             <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {skillAnalysis.pros.map((pro, i) => <li key={i}>{pro}</li>)}
                             </ul>
                        </div>
                        <div>
                             <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2"><ThumbsDown className="h-4 w-4" /> Cons</h3>
                             <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                                {skillAnalysis.cons.map((con, i) => <li key={i}>{con}</li>)}
                             </ul>
                        </div>
                    </div>
                </CardContent>
            </Card>
        )}
      </div>
    </div>
  );
}

    
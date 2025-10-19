
"use client";

import { useState, useRef } from "react";
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
import { Label } from "@/components/ui/label";
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
import {
  GitGraph,
  Wand2,
  Loader2,
  TrendingUp,
  ThumbsUp,
  ThumbsDown,
  Upload,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUserProfileStore, type UserProfile } from "@/store/user-profile";
import { suggestCareerPaths } from "@/ai/flows/suggest-career-paths";
import { analyzeSkills } from "@/ai/flows/analyze-skills";
import useStore from "@/hooks/use-store";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { extractResumeInfo } from "@/ai/flows/extract-resume-info";


const fileToDataURI = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                resolve(event.target.result as string);
            } else {
                reject(new Error("Failed to read file."));
            }
        };
        reader.onerror = (error) => {
            reject(error);
        };
        reader.readAsDataURL(file);
    });
};


const profileSchema = z.object({
  skills: z.string().min(3, "Please enter at least one skill."),
  education: z
    .string()
    .min(10, "Please provide more details about your education."),
  interests: z.string().min(3, "Please enter at least one interest."),
  experience: z
    .string()
    .min(10, "Please provide more details about your work experience."),
  goal: z.string().min(10, "Please describe your career goal."),
});

export default function SkillProfilePage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isParsing, setIsParsing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const storedProfile = useStore(useUserProfileStore, (state) => state.profile);
  const setProfile = useUserProfileStore((state) => state.setProfile);
  const setCareerPaths = useUserProfileStore((state) => state.setCareerPaths);
  const skillAnalysis = useStore(
    useUserProfileStore,
    (state) => state.skillAnalysis
  );
  const setSkillAnalysis = useUserProfileStore(
    (state) => state.setSkillAnalysis
  );

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: storedProfile || {
      skills: "",
      education: "",
      interests: "",
      experience: "",
      goal: "",
    },
    values: storedProfile || undefined, // ensures form is populated on mount
  });

  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    setIsLoading(true);
    setProfile(values);
    try {
      const [pathsResult, analysisResult] = await Promise.all([
        suggestCareerPaths({
          skills: values.skills,
          education: values.education,
          interests: values.interests,
          experience: values.experience,
          goal: values.goal,
        }),
        analyzeSkills({ skills: values.skills }),
      ]);

      setCareerPaths(pathsResult);
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

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        toast({ variant: "destructive", title: "File too large", description: "Please upload a file smaller than 4MB." });
        return;
      }
      setIsParsing(true);
      try {
        const dataUri = await fileToDataURI(file);
        const extractedData = await extractResumeInfo({ resumeDataUri: dataUri });

        form.setValue("skills", extractedData.skills);
        form.setValue("education", extractedData.education);
        form.setValue("experience", extractedData.experience);

        toast({ title: "Resume Parsed", description: "Your profile information has been pre-filled." });
      } catch (error) {
        console.error(error);
        toast({ variant: "destructive", title: "Parsing Failed", description: "Could not extract information from the resume." });
      } finally {
        setIsParsing(false);
        // Reset file input
        if(fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-5">
      <div className="lg:col-span-3 space-y-6">
        <Card>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
              <CardHeader>
                <CardTitle className="font-headline">
                  Your Skill Profile
                </CardTitle>
                <CardDescription>
                  Provide your professional details to generate personalized
                  career insights.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Auto-fill from Resume</Label>
                   <Input type="file" accept=".pdf,.doc,.docx,.txt" ref={fileInputRef} onChange={handleFileChange} className="hidden" id="resume-upload" disabled={isParsing} />
                   <Button variant="outline" className="w-full" onClick={() => fileInputRef.current?.click()} disabled={isParsing}>
                      {isParsing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                       {isParsing ? "Parsing Resume..." : "Upload Resume"}
                   </Button>
                   <FormDescription>Upload your resume to automatically fill in your skills, education, and experience.</FormDescription>
                </div>

                 <Separator />


                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Skills</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Python, TensorFlow, Project Management"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="e.g., B.S. in Computer Science, Stanford University"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="goal"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Career Goal</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., Become a Senior AI Engineer at a top tech company in 5 years."
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Describe your primary career objective.
                      </FormDescription>
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
                        <Input
                          placeholder="e.g., Natural Language Processing, Open Source"
                          {...field}
                        />
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
                        <Textarea
                          placeholder="Describe your key roles and accomplishments."
                          className="min-h-[120px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading || isParsing}>
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
              Your Skill Analysis
            </CardTitle>
            <CardDescription>
              An AI-powered analysis of your current skill set.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && !skillAnalysis && (
              <div className="text-muted-foreground text-center p-8">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-2" />
                <p>Generating your analysis...</p>
              </div>
            )}
            {!isLoading && !skillAnalysis && (
              <div className="text-muted-foreground text-center p-8">
                <p>Update your profile to generate your skill analysis.</p>
              </div>
            )}
            {skillAnalysis && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground mb-2 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" /> Overall Future-Proof
                    Index
                  </h3>
                  <div className="flex items-center gap-4">
                    <Progress
                      value={skillAnalysis.overallFutureProofIndex || 0}
                      className="w-full"
                    />
                    <span className="font-bold text-lg">
                      {skillAnalysis.overallFutureProofIndex || "N/A"}
                      <span className="text-sm text-muted-foreground">
                        /100
                      </span>
                    </span>
                  </div>
                </div>

                {skillAnalysis.futureProofSkills && (
                  <div>
                    <h3 className="text-sm font-semibold text-muted-foreground mt-4 mb-2">
                      Individual Skill Analysis
                    </h3>
                    <div className="space-y-3">
                      <TooltipProvider>
                        {skillAnalysis.futureProofSkills.map((item) => (
                          <Tooltip key={item.skill}>
                            <TooltipTrigger className="w-full text-left">
                              <div className="space-y-1">
                                <div className="flex justify-between text-sm font-medium">
                                  <span>{item.skill}</span>
                                  <span>{item.relevanceScore}/100</span>
                                </div>
                                <Progress value={item.relevanceScore} />
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="max-w-xs">{item.reasoning}</p>
                            </TooltipContent>
                          </Tooltip>
                        ))}
                      </TooltipProvider>
                    </div>
                  </div>
                )}

                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card className="bg-green-500/10 border-green-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-headline flex items-center gap-2">
                        <ThumbsUp className="h-5 w-5 text-green-500" /> Pros
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {skillAnalysis.pros.map((pro, i) => (
                          <li key={i}>{pro}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  <Card className="bg-red-500/10 border-red-500/20">
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base font-headline flex items-center gap-2">
                        <ThumbsDown className="h-5 w-5 text-red-500" /> Cons
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                        {skillAnalysis.cons.map((con, i) => (
                          <li key={i}>{con}</li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

    
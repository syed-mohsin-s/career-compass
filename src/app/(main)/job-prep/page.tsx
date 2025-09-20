"use client";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { FileUp, Linkedin, Wand2, Loader2, Sparkles, MapPin, Code2, GraduationCap } from "lucide-react";
import { optimizeResumeAndLinkedIn, OptimizeResumeAndLinkedInOutput } from "@/ai/flows/optimize-resume-linkedin";
import { useToast } from "@/hooks/use-toast";

export default function JobPrepPage() {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [resume, setResume] = useState("");
  const [linkedin, setLinkedin] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [result, setResult] = useState<OptimizeResumeAndLinkedInOutput | null>(null);
  const [activeTab, setActiveTab] = useState("resume");

  const handleOptimize = async () => {
    if ((activeTab === 'resume' && !resume) || (activeTab === 'linkedin' && !linkedin) || !jobDescription) {
      toast({
        variant: "destructive",
        title: "Missing Information",
        description: "Please provide both your content and the job description.",
      });
      return;
    }
    setIsLoading(true);
    setResult(null);
    try {
      const response = await optimizeResumeAndLinkedIn({
        resume: resume,
        linkedInProfile: linkedin,
        jobDescription: jobDescription,
      });
      setResult(response);
      toast({
        title: "Optimization Complete!",
        description: "Your results are ready below.",
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Optimization Failed",
        description: "An error occurred. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Tabs defaultValue="resume" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="resume">
              <FileUp className="mr-2 h-4 w-4" /> Resume Optimizer
            </TabsTrigger>
            <TabsTrigger value="linkedin">
              <Linkedin className="mr-2 h-4 w-4" /> LinkedIn Optimizer
            </TabsTrigger>
          </TabsList>
          <TabsContent value="resume">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">Resume Optimizer</CardTitle>
                <CardDescription>
                  Paste your resume and a job description to get AI-powered suggestions.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your Resume</label>
                  <Textarea
                    placeholder="Paste your full resume here..."
                    className="min-h-[200px]"
                    value={resume}
                    onChange={(e) => setResume(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Job Description</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </CardContent>
              <CardFooter>
                 <Button className="w-full" onClick={handleOptimize} disabled={isLoading}>
                  {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                   Optimize Resume
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle className="font-headline">LinkedIn Optimizer</CardTitle>
                <CardDescription>
                  Provide your LinkedIn profile content for AI-driven improvements.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Your LinkedIn Profile Summary</label>
                  <Textarea
                    placeholder="Paste your LinkedIn 'About' section and other relevant text here..."
                    className="min-h-[200px]"
                     value={linkedin}
                    onChange={(e) => setLinkedin(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Target Job Description</label>
                  <Textarea
                    placeholder="Paste the job description here..."
                    className="min-h-[150px]"
                    value={jobDescription}
                    onChange={(e) => setJobDescription(e.target.value)}
                  />
                </div>
              </CardContent>
               <CardFooter>
                <Button className="w-full" onClick={handleOptimize} disabled={isLoading}>
                   {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Wand2 className="mr-2 h-4 w-4" />}
                   Optimize LinkedIn
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
        
        {isLoading && (
          <Card>
            <CardContent className="p-6 flex flex-col items-center justify-center text-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
              <h3 className="font-headline text-lg">Optimizing your profile...</h3>
              <p className="text-muted-foreground">The AI is working its magic. Please wait a moment.</p>
            </CardContent>
          </Card>
        )}

        {result && (
          <Card>
            <CardHeader>
              <CardTitle className="font-headline flex items-center gap-2"><Sparkles className="text-accent"/> Optimization Results</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {activeTab === 'resume' && result.optimizedResume && (
                  <div>
                      <h3 className="font-semibold mb-2">Optimized Resume</h3>
                      <Textarea readOnly value={result.optimizedResume} className="min-h-[200px] bg-muted"/>
                  </div>
              )}
               {activeTab === 'linkedin' && result.optimizedLinkedInProfile && (
                  <div>
                      <h3 className="font-semibold mb-2">Optimized LinkedIn Profile</h3>
                      <Textarea readOnly value={result.optimizedLinkedInProfile} className="min-h-[200px] bg-muted"/>
                  </div>
              )}
               {result.suggestions && result.suggestions.length > 0 && (
                  <div>
                      <h3 className="font-semibold mb-2">Suggestions for Improvement</h3>
                      <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground bg-muted p-4 rounded-md">
                          {result.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                  </div>
               )}
            </CardContent>
          </Card>
        )}

      </div>
      <div className="lg:col-span-1 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline">Job Readiness Score</CardTitle>
            <CardDescription>Your alignment with target roles based on your profile.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4">
            <div className="relative h-32 w-32">
                <svg className="h-full w-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
                    <g className="origin-center -rotate-90 transform">
                        <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-primary" strokeWidth="2" strokeDasharray="100" strokeDashoffset="25"></circle>
                    </g>
                </svg>
                <div className="absolute top-1/2 start-1/2 transform -translate-y-1/2 -translate-x-1/2">
                    <span className="text-center text-3xl font-bold text-gray-800 dark:text-white">75%</span>
                </div>
            </div>
            <p className="text-center text-muted-foreground text-sm">
                You're a strong candidate! A few more tweaks will make you stand out.
            </p>
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline flex items-center gap-2"><MapPin/>Local Opportunities</CardTitle>
                <CardDescription>Discover internships, hackathons, and scholarships near you.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-4 text-sm">
                    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="p-2 bg-blue-100 dark:bg-blue-900/50 rounded-md"><GraduationCap className="h-5 w-5 text-blue-500"/></div>
                        <div>
                           <span className="font-semibold">AI/ML Internship</span>
                           <p className="text-muted-foreground text-xs">TechCorp - Mountain View, CA</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">View</Button>
                    </li>
                     <li className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="p-2 bg-green-100 dark:bg-green-900/50 rounded-md"><Code2 className="h-5 w-5 text-green-500"/></div>
                         <div>
                           <span className="font-semibold">Cloud Dev Hackathon</span>
                           <p className="text-muted-foreground text-xs">Community Center - Sunnyvale, CA</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">Join</Button>
                    </li>
                    <li className="flex items-start gap-3 p-2 rounded-md hover:bg-muted">
                        <div className="p-2 bg-purple-100 dark:bg-purple-900/50 rounded-md"><GraduationCap className="h-5 w-5 text-purple-500"/></div>
                         <div>
                           <span className="font-semibold">Future of Tech Scholarship</span>
                           <p className="text-muted-foreground text-xs">State University Foundation</p>
                        </div>
                        <Button variant="ghost" size="sm" className="ml-auto">Apply</Button>
                    </li>
                </ul>
            </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">Optimization History</CardTitle>
                <CardDescription>Review and restore previous versions of your documents.</CardDescription>
            </CardHeader>
            <CardContent>
                <ul className="space-y-2 text-sm">
                    <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                        <span>Resume_v3.txt <span className="text-muted-foreground">- 2 days ago</span></span>
                        <Button variant="ghost" size="sm">View</Button>
                    </li>
                     <li className="flex justify-between items-center p-2 rounded-md hover:bg-muted">
                        <span>LinkedIn_Profile_v2.txt <span className="text-muted-foreground">- 5 days ago</span></span>
                        <Button variant="ghost" size="sm">View</Button>
                    </li>
                </ul>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

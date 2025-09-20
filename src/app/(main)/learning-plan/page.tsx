"use client";

import { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CheckCircle2, Link as LinkIcon, Clock, Info, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useUserProfileStore } from "@/store/user-profile";
import useStore from "@/hooks/use-store";
import { Skeleton } from "@/components/ui/skeleton";

type StepStatus = "Not Started" | "In Progress" | "Completed";
const STATUSES: StepStatus[] = ["Not Started", "In Progress", "Completed"];

export default function LearningPlanPage() {
  const learningPlan = useStore(useUserProfileStore, (state) => state.learningPlan);
  const [stepStatuses, setStepStatuses] = useState<Record<string, StepStatus>>({});

  useEffect(() => {
    if (learningPlan?.roadmap) {
      const initialStatuses: Record<string, StepStatus> = {};
      learningPlan.roadmap.forEach(step => {
        initialStatuses[step.skill] = "Not Started";
      });
      setStepStatuses(initialStatuses);
    }
  }, [learningPlan]);
  
  const handleStatusChange = (skill: string, newStatus: StepStatus) => {
    setStepStatuses(prev => ({...prev, [skill]: newStatus}));
  };

  const completedSteps = Object.values(stepStatuses).filter(s => s === "Completed").length;
  const totalSteps = learningPlan?.roadmap?.length || 0;
  const progress = totalSteps > 0 ? (completedSteps / totalSteps) * 100 : 0;

  if (learningPlan === undefined) {
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
        <Skeleton className="h-20 w-full" />
        <Skeleton className="h-20 w-full" />
      </div>
    );
  }

  if (!learningPlan) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center bg-card border rounded-lg p-12">
        <Info className="h-12 w-12 text-muted-foreground mb-4" />
        <h1 className="font-headline text-2xl font-bold">No Learning Plan Generated</h1>
        <p className="text-muted-foreground max-w-md mx-auto mt-2">
          You haven't generated a learning plan yet. Go to the Career Paths page and select a path to get started.
        </p>
        <Button asChild className="mt-6">
          <Link href="/career-paths">Explore Career Paths</Link>
        </Button>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="font-headline text-2xl">Your Learning Plan for: {learningPlan.roadmapTitle || "Your Career Path"}</CardTitle>
          <CardDescription>{learningPlan.summary}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Progress value={progress} className="w-full" />
            <span className="font-bold text-lg">{Math.round(progress)}%</span>
          </div>
        </CardContent>
      </Card>
      <Accordion type="single" collapsible defaultValue="item-0" className="w-full">
        {learningPlan.roadmap.map((step, index) => {
          const status = stepStatuses[step.skill] || "Not Started";
          return (
            <AccordionItem value={`item-${index}`} key={step.skill} className="bg-card border rounded-lg mb-4">
              <div className="flex items-center justify-between p-6">
                 <AccordionTrigger className="p-0 hover:no-underline flex-1">
                  <div className="flex items-center gap-4 w-full">
                    <CheckCircle2 className={`h-6 w-6 transition-colors ${status === "Completed" ? 'text-green-500' : 'text-muted-foreground'}`} />
                    <div className="text-left flex-1">
                      <h3 className="font-headline text-lg">{step.skill}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </div>
                  </div>
                </AccordionTrigger>
                <div className="ml-auto flex items-center gap-4 pl-4" onClick={(e) => e.stopPropagation()}>
                  <Select value={status} onValueChange={(newStatus: StepStatus) => handleStatusChange(step.skill, newStatus)}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      {STATUSES.map(s => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <AccordionContent className="p-6 pt-0">
                <h4 className="font-semibold mb-3">Learning Resources</h4>
                <div className="space-y-3">
                  {step.resources.map(resource => (
                    <a key={resource.title} href={resource.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-between p-3 rounded-md border bg-background/50 hover:border-primary transition-colors">
                      <div>
                        <div className="font-medium hover:underline flex items-center gap-2">
                          {resource.title} <LinkIcon className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <div className="text-sm text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1 mt-1">
                          <span>{resource.provider}</span>
                          <Badge variant="outline">{resource.type}</Badge>
                          <span className="flex items-center gap-1"><Clock className="h-4 w-4" />{resource.estimatedDuration}</span>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}

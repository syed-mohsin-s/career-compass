
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GitGraph, CheckCircle, XCircle, ArrowRight, Loader2, Info, Briefcase, BookOpen, FlaskConical } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  ResponsiveContainer,
} from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

import { useUserProfileStore } from '@/store/user-profile';
import useStore from '@/hooks/use-store';
import { generateJobSkillGraph, GenerateJobSkillGraphOutput } from '@/ai/flows/generate-job-skill-graph';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

const trendingRoles = [
  'AI Specialist',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Cloud Engineer',
  'UX/UI Designer',
  'Software Engineer',
  'Product Manager'
];

const chartConfig = {
  value: {
    label: 'Importance',
    color: 'hsl(var(--chart-1))',
  },
};

export default function SkillTreePage() {
  const { toast } = useToast();
  const profile = useStore(useUserProfileStore, (state) => state.profile);

  const [isLoading, setIsLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string>(trendingRoles[0]);
  const [skillGraph, setSkillGraph] = useState<GenerateJobSkillGraphOutput | null>(null);

  useEffect(() => {
    const fetchSkillGraph = async () => {
      if (selectedRole) {
        setIsLoading(true);
        setSkillGraph(null);
        try {
          const graphData = await generateJobSkillGraph({
            jobRole: selectedRole
          });
          setSkillGraph(graphData);
        } catch (error) {
          console.error('Failed to generate skill graph', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `Could not generate the skill graph for ${selectedRole}. Please try again.`,
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSkillGraph();
  }, [selectedRole, toast]);

  const userSkills = profile?.skills?.toLowerCase().split(',').map((s) => s.trim()) || [];
  
  const requiredSkills = skillGraph?.skillGraphData.map(s => s.subject.toLowerCase()) || [];

  const skillGaps = requiredSkills.map(skill => ({
    name: skill,
    known: userSkills.includes(skill)
  }));


  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <GitGraph />
              Job Role Skill Requirements
            </CardTitle>
            <CardDescription>
              A visual representation of the key skills required for different job roles.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             <div className="max-w-xs space-y-2">
                <Label>Select a Job Role</Label>
                <Select value={selectedRole} onValueChange={setSelectedRole}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role..." />
                  </SelectTrigger>
                  <SelectContent>
                    {trendingRoles.map(role => (
                      <SelectItem key={role} value={role}>{role}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
            </div>
            <div className="w-full aspect-video flex items-center justify-center">
              {isLoading && (
                <div className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">Generating Skill Graph for {selectedRole}...</h3>
                </div>
              )}
              {!isLoading && !skillGraph && (
                 <div className="w-full h-full bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
                   <Info className="h-8 w-8 text-muted-foreground mb-4" />
                   <h3 className="font-bold text-lg mb-2">No Skill Data</h3>
                   <p className="text-muted-foreground mb-4">Select a role to generate its skill graph.</p>
                </div>
              )}
              {skillGraph && (
                <ChartContainer config={chartConfig} className="w-full h-full">
                  <ResponsiveContainer>
                    <RadarChart data={skillGraph.skillGraphData}>
                      <ChartTooltip
                        cursor={false}
                        content={<ChartTooltipContent />}
                      />
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name="Importance"
                        dataKey="value"
                        stroke="hsl(var(--chart-1))"
                        fill="hsl(var(--chart-1))"
                        fillOpacity={0.6}
                      />
                    </RadarChart>
                  </ResponsiveContainer>
                </ChartContainer>
              )}
            </div>
          </CardContent>
        </Card>
        
        {skillGaps.length > 0 && (
             <Card>
                <CardHeader>
                    <CardTitle className="font-headline text-lg">Skill Gap Analysis</CardTitle>
                    <CardDescription>Comparison of your skills against the requirements for a {selectedRole}.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-wrap gap-2">
                        {skillGaps.map(skill => (
                            <Badge key={skill.name} variant={skill.known ? "success" : "outline"} className="capitalize">
                                {skill.known ? <CheckCircle className="h-3 w-3 mr-1.5" /> : <XCircle className="h-3 w-3 mr-1.5" />}
                                {skill.name}
                            </Badge>
                        ))}
                    </div>
                </CardContent>
            </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">
              Your Current Skills
            </CardTitle>
          </CardHeader>
          <CardContent>
            {userSkills.length > 0 ? (
              <div className="flex flex-wrap gap-2">
                {profile?.skills?.split(',').map((skill) => (
                  <Badge key={skill} variant="secondary">
                    {skill.trim()}
                  </Badge>
                ))}
              </div>
            ) : (
                <div className="text-sm text-muted-foreground text-center p-4 border rounded-lg">
                 <p className="mb-2">Your skills aren't listed yet.</p>
                 <Button size="sm" asChild>
                    <Link href="/skill-profile">Complete Profile</Link>
                 </Button>
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
            <CardHeader>
                <CardTitle className="font-headline">What's Next?</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-full justify-start" variant="outline" asChild>
                        <Link href="/career-paths"><Briefcase className="mr-2"/> View Career Paths</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>See AI-suggested career paths</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-full justify-start" variant="outline" asChild>
                        <Link href="/learning-plan"><BookOpen className="mr-2"/> Generate Learning Plan</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Create a personalized learning roadmap</TooltipContent>
                </Tooltip>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button className="w-full justify-start" variant="outline" asChild>
                        <Link href="/simulator"><FlaskConical className="mr-2"/> Try the Simulator</Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Simulate learning a new skill</TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

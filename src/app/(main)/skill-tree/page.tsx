
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GitGraph, CheckCircle, ArrowRight, Loader2, Info } from 'lucide-react';
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

import { useUserProfileStore } from '@/store/user-profile';
import useStore from '@/hooks/use-store';
import { generateSkillGraph, GenerateSkillGraphOutput } from '@/ai/flows/generate-skill-graph';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

const trendingRoles = [
  'AI Specialist',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Cloud Engineer',
  'UX/UI Designer',
];

const chartConfig = {
  value: {
    label: 'Proficiency',
    color: 'hsl(var(--chart-1))',
  },
};

export default function SkillTreePage() {
  const { toast } = useToast();
  const profile = useStore(useUserProfileStore, (state) => state.profile);
  const skillGraph = useStore(useUserProfileStore, (state) => state.skillGraph);
  const setSkillGraph = useUserProfileStore((state) => state.setSkillGraph);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchSkillGraph = async () => {
      if (profile && !skillGraph) {
        setIsLoading(true);
        try {
          const graphData = await generateSkillGraph({
            skills: profile.skills.split(','),
            education: profile.education,
            interests: profile.interests,
            workExperience: profile.experience,
          });
          setSkillGraph(graphData);
        } catch (error) {
          console.error('Failed to generate skill graph', error);
          toast({
            variant: 'destructive',
            title: 'Error',
            description: 'Could not generate your skill graph. Please try again.',
          });
        } finally {
          setIsLoading(false);
        }
      }
    };

    fetchSkillGraph();
  }, [profile, skillGraph, setSkillGraph, toast]);

  const userSkills = profile?.skills?.split(',').map((s) => s.trim()) || [];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
        <Card>
          <CardHeader>
            <CardTitle className="font-headline flex items-center gap-2">
              <GitGraph />
              Skill Tree Visualization
            </CardTitle>
            <CardDescription>
              A visual representation of your skills based on your profile.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading && (
              <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
                 <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                 <h3 className="font-bold text-lg mb-2">Generating Your Skill Graph...</h3>
              </div>
            )}
            {!isLoading && !skillGraph && (
               <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
                 <Info className="h-8 w-8 text-muted-foreground mb-4" />
                 <h3 className="font-bold text-lg mb-2">No Skill Data</h3>
                 <p className="text-muted-foreground mb-4">Please complete your profile to generate your skill graph.</p>
                 <Button asChild>
                    <Link href="/skill-profile">Complete Profile</Link>
                 </Button>
              </div>
            )}
            {skillGraph && (
              <ChartContainer config={chartConfig} className="w-full aspect-video">
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
                      name="Proficiency"
                      dataKey="value"
                      stroke="hsl(var(--chart-1))"
                      fill="hsl(var(--chart-1))"
                      fillOpacity={0.6}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </ChartContainer>
            )}
          </CardContent>
        </Card>
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
                {userSkills.map((skill) => (
                  <Badge key={skill} variant="secondary">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    {skill}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No skills in your profile yet.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="font-headline text-lg">
              Trending Roles
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {trendingRoles.map((role) => (
                <div
                  key={role}
                  className="flex items-center justify-between text-sm p-2 rounded-md hover:bg-muted"
                >
                  <span>{role}</span>
                  <ArrowRight className="w-4 h-4 text-muted-foreground" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

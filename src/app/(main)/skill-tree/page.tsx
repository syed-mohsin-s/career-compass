
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from '@/components/ui/label';

import { useUserProfileStore } from '@/store/user-profile';
import useStore from '@/hooks/use-store';
import { generateJobSkillGraph, GenerateJobSkillGraphOutput } from '@/ai/flows/generate-job-skill-graph';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

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

  const userSkills = profile?.skills?.split(',').map((s) => s.trim()) || [];

  return (
    <div className="grid gap-6 md:grid-cols-3">
      <div className="md:col-span-2">
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
                 <Button className="w-full justify-start" variant="ghost" asChild>
                    <Link href="/career-paths"><ArrowRight className="mr-2"/> See matching career paths</Link>
                </Button>
                 <Button className="w-full justify-start" variant="ghost" asChild>
                    <Link href="/learning-plan"><ArrowRight className="mr-2"/> Create a learning plan</Link>
                </Button>
                 <Button className="w-full justify-start" variant="ghost" asChild>
                    <Link href="/simulator"><ArrowRight className="mr-2"/> Simulate learning a new skill</Link>
                </Button>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

// src/app/(main)/skill-tree/page.tsx
'use client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { GitGraph, CheckCircle, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useUserProfileStore } from '@/store/user-profile';
import useStore from '@/hooks/use-store';

const trendingRoles = [
  'AI Specialist',
  'Data Scientist',
  'Cybersecurity Analyst',
  'Cloud Engineer',
  'UX/UI Designer',
];

export default function SkillTreePage() {
  const profile = useStore(useUserProfileStore, (state) => state.profile);
  const userSkills = profile?.skills.split(',').map((s) => s.trim()) || [];

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
              A visual representation of your mastered skills versus the skills
              required for your target career paths.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
              <h3 className="font-bold text-lg mb-2">Coming Soon!</h3>
              <p className="text-muted-foreground">
                We're developing an interactive graph to help you visualize
                your skill gaps and track your progress. This will be powered
                by a graph visualization library to show you exactly where you
                stand.
              </p>
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

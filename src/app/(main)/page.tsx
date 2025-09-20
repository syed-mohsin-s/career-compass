import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card';
import {
  User,
  Briefcase,
  BookOpen,
  ClipboardList,
  MessageSquare,
  GitGraph,
  FlaskConical,
  TrendingUp,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const features = [
  {
    title: 'Skill Profile',
    description: 'Define and visualize your professional skills.',
    icon: User,
    href: '/skill-profile',
    color: 'text-blue-400',
    bgColor: 'bg-blue-950/20',
  },
  {
    title: 'Career Paths',
    description: 'Discover AI-suggested career journeys.',
    icon: Briefcase,
    href: '/career-paths',
    color: 'text-green-400',
    bgColor: 'bg-green-950/20',
  },
  {
    title: 'Learning Plan',
    description: 'Get a personalized roadmap to success.',
    icon: BookOpen,
    href: '/learning-plan',
    color: 'text-purple-400',
    bgColor: 'bg-purple-950/20',
  },
  {
    title: 'Job Prep',
    description: 'Optimize your resume and LinkedIn profile.',
    icon: ClipboardList,
    href: '/job-prep',
    color: 'text-orange-400',
    bgColor: 'bg-orange-950/20',
  },
  {
    title: 'Mock Interview',
    description: 'Practice with our real-time AI interviewer.',
    icon: MessageSquare,
    href: '/mock-interview',
    color: 'text-red-400',
    bgColor: 'bg-red-950/20',
  },
  {
    title: 'Skill Tree',
    description: 'Visualize your skill mastery.',
    icon: GitGraph,
    href: '/skill-tree',
    color: 'text-indigo-400',
    bgColor: 'bg-indigo-950/20',
  },
  {
    title: 'What-If Simulator',
    description: 'See the impact of learning a new skill.',
    icon: FlaskConical,
    href: '/simulator',
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-950/20',
  },
   {
    title: 'Future-Proof Index',
    description: 'Predict the relevance of skills and jobs.',
    icon: TrendingUp,
    href: '/career-paths',
    color: 'text-cyan-400',
    bgColor: 'bg-cyan-950/20',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8">
      <Card className="bg-gradient-to-br from-primary/10 to-transparent">
        <CardHeader>
          <CardTitle className="font-headline text-4xl">Welcome to Career Compass</CardTitle>
          <CardDescription className="text-lg text-muted-foreground max-w-2xl">
            Your AI-powered guide to a successful career. Let's get started on your journey to professional growth and success.
          </CardDescription>
        </CardHeader>
        <CardContent>
            <Button size="lg">Start Your Journey</Button>
        </CardContent>
      </Card>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title} className="group">
            <Card className="hover:shadow-xl transition-all duration-300 h-full flex flex-col hover:border-primary/50 transform hover:-translate-y-1">
              <CardHeader>
                <div className={`p-3 rounded-lg inline-block w-fit mb-4 ${feature.bgColor}`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="font-headline text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent className="flex-1">
                <CardDescription className="text-base">{feature.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

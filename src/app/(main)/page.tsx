import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  User,
  Briefcase,
  BookOpen,
  ClipboardList,
  MessageSquare,
  GitGraph,
  FlaskConical,
  Trophy,
  Users,
  TrendingUp,
} from 'lucide-react';

const features = [
  {
    title: 'Skill Profile',
    description: 'Define and visualize your professional skills.',
    icon: User,
    href: '/skill-profile',
    color: 'text-blue-500',
  },
  {
    title: 'Career Paths',
    description: 'Discover AI-suggested career journeys.',
    icon: Briefcase,
    href: '/career-paths',
    color: 'text-green-500',
  },
  {
    title: 'Learning Plan',
    description: 'Get a personalized roadmap to success.',
    icon: BookOpen,
    href: '/learning-plan',
    color: 'text-purple-500',
  },
  {
    title: 'Job Prep',
    description: 'Optimize your resume and LinkedIn profile.',
    icon: ClipboardList,
    href: '/job-prep',
    color: 'text-orange-500',
  },
  {
    title: 'Mock Interview',
    description: 'Practice with our real-time AI interviewer.',
    icon: MessageSquare,
    href: '/mock-interview',
    color: 'text-red-500',
  },
  {
    title: 'Skill Tree',
    description: 'Visualize your skill mastery.',
    icon: GitGraph,
    href: '/skill-tree',
    color: 'text-indigo-500',
  },
  {
    title: 'What-If Simulator',
    description: 'See the impact of learning a new skill.',
    icon: FlaskConical,
    href: '/simulator',
    color: 'text-yellow-500',
  },
   {
    title: 'Future-Proof Index',
    description: 'Predict the relevance of skills and jobs.',
    icon: TrendingUp,
    href: '/career-paths',
    color: 'text-cyan-500',
  },
];

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-headline text-3xl font-bold">Welcome to Career Compass</h1>
        <p className="text-muted-foreground">Your AI-powered guide to a successful career. Let's get started.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {features.map((feature) => (
          <Link href={feature.href} key={feature.title}>
            <Card className="hover:shadow-lg transition-shadow duration-300 h-full flex flex-col hover:border-primary">
              <CardHeader className="flex-1">
                <div className="flex items-center gap-4">
                  <feature.icon className={`h-8 w-8 ${feature.color}`} />
                  <div className="flex flex-col">
                    <CardTitle className="font-headline text-lg">{feature.title}</CardTitle>
                    <CardDescription className="text-sm mt-1">{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}

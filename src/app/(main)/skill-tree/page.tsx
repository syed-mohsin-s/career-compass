import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitGraph } from "lucide-react";

export default function SkillTreePage() {
  return (
    <div className="flex justify-center items-start pt-10">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="font-headline flex items-center gap-2">
            <GitGraph />
            Skill Tree Visualization
          </CardTitle>
          <CardDescription>
            A visual representation of your mastered skills versus the skills required for your target career paths.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full aspect-video bg-muted rounded-lg flex flex-col items-center justify-center text-center p-4">
            <h3 className="font-bold text-lg mb-2">Coming Soon!</h3>
            <p className="text-muted-foreground">
              We're developing an interactive graph to help you visualize your skill gaps and track your progress. This will be powered by a graph visualization library to show you exactly where you stand.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { WorkoutType } from '@/types/workout';
import { Dumbbell } from 'lucide-react';

type WorkoutCardProps = {
  type: WorkoutType;
  exercises: string[];
  onStart: () => void;
};

export const WorkoutCard = ({ type, exercises, onStart }: WorkoutCardProps) => {
  return (
    <Card className="border-2 hover:border-primary transition-colors cursor-pointer" onClick={onStart}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <Dumbbell className="h-6 w-6 text-primary" />
          Workout {type}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul className="space-y-2">
          {exercises.map((exercise, index) => (
            <li key={index} className="text-muted-foreground">
              • {exercise}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

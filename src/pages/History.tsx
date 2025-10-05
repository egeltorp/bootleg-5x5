import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getWorkouts } from '@/lib/storage';
import { Workout } from '@/types/workout';
import { ArrowLeft, Calendar, Dumbbell, TrendingUp } from 'lucide-react';
import { format } from 'date-fns';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

type ProgressData = {
  date: string;
  [key: string]: number | string;
};

export default function History() {
  const navigate = useNavigate();
  const [workouts, setWorkouts] = useState<Workout[]>([]);

  useEffect(() => {
    const allWorkouts = getWorkouts();
    setWorkouts(allWorkouts.reverse());
  }, []);

  const getProgressData = (): ProgressData[] => {
    const exerciseProgress: { [key: string]: { date: string; weight: number }[] } = {};

    workouts.slice().reverse().forEach((workout) => {
      workout.exercises.forEach((exercise) => {
        if (!exerciseProgress[exercise.name]) {
          exerciseProgress[exercise.name] = [];
        }
        exerciseProgress[exercise.name].push({
          date: format(new Date(workout.date), 'MMM d'),
          weight: exercise.weight,
        });
      });
    });

    // Convert to chart format
    const allDates = [...new Set(workouts.slice().reverse().map(w => 
      format(new Date(w.date), 'MMM d')
    ))];

    return allDates.map((date) => {
      const dataPoint: ProgressData = { date };
      Object.keys(exerciseProgress).forEach((exerciseName) => {
        const exercise = exerciseProgress[exerciseName].find(e => e.date === date);
        if (exercise) {
          dataPoint[exerciseName] = exercise.weight;
        }
      });
      return dataPoint;
    });
  };

  const progressData = getProgressData();
  const exerciseNames = workouts.length > 0 
    ? [...new Set(workouts.flatMap(w => w.exercises.map(e => e.name)))]
    : [];

  const colors = ['#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444', '#ec4899'];

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Workout History</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <Tabs defaultValue="history" className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="history">
              <Calendar className="h-4 w-4 mr-2" />
              History
            </TabsTrigger>
            <TabsTrigger value="progress">
              <TrendingUp className="h-4 w-4 mr-2" />
              Progress
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {workouts.length === 0 ? (
              <div className="text-center py-12">
                <Dumbbell className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No workouts yet. Start your first workout!</p>
                <Button className="mt-4" onClick={() => navigate('/')}>
                  Go to Home
                </Button>
              </div>
            ) : (
              workouts.map((workout) => (
                <Card key={workout.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-lg">Workout {workout.type}</CardTitle>
                      <div className="flex items-center text-sm text-muted-foreground">
                        <Calendar className="h-4 w-4 mr-1" />
                        {format(new Date(workout.date), 'MMM d, yyyy')}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {workout.exercises.map((exercise, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-3 rounded-lg bg-muted/50"
                      >
                        <div>
                          <p className="font-medium">{exercise.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {exercise.sets}x{exercise.reps}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <TrendingUp className="h-4 w-4 text-primary" />
                          <span className="font-bold text-lg">{exercise.weight} kg</span>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="progress" className="space-y-4">
            {progressData.length === 0 ? (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No progress data yet</p>
                <p className="text-sm text-muted-foreground mt-2">Complete workouts to see your strength progression</p>
              </div>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Weight Progression</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={400}>
                    <LineChart data={progressData}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                      <XAxis 
                        dataKey="date" 
                        tick={{ fontSize: 12 }}
                        angle={-45}
                        textAnchor="end"
                        height={80}
                      />
                      <YAxis 
                        label={{ value: 'Weight (kg)', angle: -90, position: 'insideLeft' }}
                        tick={{ fontSize: 12 }}
                      />
                      <Tooltip 
                        contentStyle={{ 
                          backgroundColor: 'hsl(var(--background))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px'
                        }}
                      />
                      <Legend />
                      {exerciseNames.map((name, index) => (
                        <Line
                          key={name}
                          type="monotone"
                          dataKey={name}
                          stroke={colors[index % colors.length]}
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6 }}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}

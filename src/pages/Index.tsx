import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { WorkoutCard } from '@/components/WorkoutCard';
import { getLastWorkout } from '@/lib/storage';
import { getNextWorkoutDate, getNextWorkoutType, formatNextWorkoutDate } from '@/lib/workoutScheduler';
import { WORKOUT_A_EXERCISES, WORKOUT_B_EXERCISES } from '@/lib/workoutData';
import { Calendar, History, Moon, Sun, Dumbbell, Calculator } from 'lucide-react';

export default function Index() {
  const navigate = useNavigate();
  const [nextWorkoutType, setNextWorkoutType] = useState<'A' | 'B'>('A');
  const [nextWorkoutDate, setNextWorkoutDate] = useState<Date>(new Date());
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check dark mode preference
    const storedTheme = localStorage.getItem("theme");

    if (storedTheme === "light") {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    }


    // Calculate next workout
    const lastWorkout = getLastWorkout();
    const nextType = getNextWorkoutType(lastWorkout?.type);
    const nextDate = getNextWorkoutDate(lastWorkout?.date);
    
    setNextWorkoutType(nextType);
    setNextWorkoutDate(nextDate);
  }, []);

  const toggleTheme = () => {
    document.documentElement.classList.toggle('dark');
    setIsDark(!isDark);
  };

  const startWorkout = (type: 'A' | 'B') => {
    navigate(`/workout?type=${type}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b">
        <div className="max-w-2xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Dumbbell className="h-6 w-6 text-primary" />
            <h1 className="text-xl font-bold">Bootleg 5×5</h1>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon" onClick={toggleTheme}>
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/plate-calculator')}>
              <Calculator className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => navigate('/history')}>
              <History className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-8">
        <div className="text-center space-y-2 py-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary font-medium">
            <Calendar className="h-4 w-4" />
            Next Workout: {formatNextWorkoutDate(nextWorkoutDate)}
          </div>
          <h2 className="text-3xl font-bold">Ready to lift?</h2>
          <p className="text-muted-foreground">Choose your workout to get started</p>
        </div>

        <div className="space-y-4">
          <WorkoutCard
            type="A"
            exercises={WORKOUT_A_EXERCISES.map((ex) => ex.name)}
            onStart={() => startWorkout('A')}
          />
          <WorkoutCard
            type="B"
            exercises={WORKOUT_B_EXERCISES.map((ex) => ex.name)}
            onStart={() => startWorkout('B')}
          />
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4">
          <p>Recommended: Workout {nextWorkoutType}</p>
          <p className="text-xs mt-2">Train 3 days per week: Monday • Wednesday • Friday</p>
        </div>
      </main>
    </div>
  );
}

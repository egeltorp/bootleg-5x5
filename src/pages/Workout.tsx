import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ExerciseTracker } from '@/components/ExerciseTracker';
import { ActiveExercise, Workout } from '@/types/workout';
import { getWorkoutExercises, WEIGHT_INCREMENT } from '@/lib/workoutData';
import { saveWorkout, updateExerciseWeight, getCurrentWeights } from '@/lib/storage';
import { ArrowLeft, Check } from 'lucide-react';
import { toast } from 'sonner';

export default function WorkoutPage() {
  const navigate = useNavigate();
  const [workoutType, setWorkoutType] = useState<'A' | 'B'>('A');
  const [exercises, setExercises] = useState<ActiveExercise[]>([]);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);

  useEffect(() => {
    // Get workout type from URL or localStorage
    const params = new URLSearchParams(window.location.search);
    const type = (params.get('type') as 'A' | 'B') || 'A';
    setWorkoutType(type);

    // Initialize exercises with saved weights
    const savedWeights = getCurrentWeights();
    const workoutExercises = getWorkoutExercises(type);
    
    const initializedExercises: ActiveExercise[] = workoutExercises.map((ex) => ({
      ...ex,
      weight: savedWeights[ex.name] || ex.weight,
      setLogs: Array.from({ length: ex.sets }, () => ({
        set: 0,
        reps: 0,
        completed: false,
      })),
      currentSet: 0,
    }));

    setExercises(initializedExercises);
  }, []);

  const handleSetComplete = (setIndex: number, reps: number, failed = false) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[currentExerciseIndex];
    
    exercise.setLogs[setIndex] = {
      set: setIndex + 1,
      reps,
      completed: true,
      failed,
    };

    // Move to next set or next exercise
    if (setIndex < exercise.sets - 1) {
      exercise.currentSet = setIndex + 1;
    } else if (currentExerciseIndex < exercises.length - 1) {
      setCurrentExerciseIndex(currentExerciseIndex + 1);
      toast.success(`${exercise.name} completed!`);
    } else {
      // Workout complete
      handleWorkoutComplete(updatedExercises);
    }

    setExercises(updatedExercises);
  };

  const handleWeightChange = (newWeight: number) => {
    const updatedExercises = [...exercises];
    const exercise = updatedExercises[currentExerciseIndex];
    exercise.weight = newWeight;
    setExercises(updatedExercises);
    updateExerciseWeight(exercise.name, newWeight);
  };

  const handleWorkoutComplete = (completedExercises: ActiveExercise[]) => {
    const workout: Workout = {
      id: Date.now().toString(),
      type: workoutType,
      date: new Date().toISOString(),
      exercises: completedExercises.map((ex) => ({
        name: ex.name,
        weight: ex.weight,
        sets: ex.sets,
        reps: ex.reps,
        completed: true,
      })),
      completed: true,
    };

    saveWorkout(workout);

    // Auto-increment weights for next workout (only if all sets completed without failure)
    completedExercises.forEach((ex) => {
      const allSetsCompletedSuccessfully = ex.setLogs.every(
        (log) => log.completed && !log.failed && log.reps >= ex.reps
      );
      if (allSetsCompletedSuccessfully) {
        updateExerciseWeight(ex.name, ex.weight + WEIGHT_INCREMENT);
      }
    });

    toast.success('Workout complete! 💪');
    navigate('/history');
  };

  if (exercises.length === 0) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  const currentExercise = exercises[currentExerciseIndex];
  const allSetsComplete = currentExercise.setLogs.every((log) => log.completed);
  const isLastExercise = currentExerciseIndex === exercises.length - 1;

  return (
    <div className="min-h-screen bg-background pb-20">
      <header className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b px-4 py-4">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          <Button variant="ghost" size="icon" onClick={() => navigate('/')}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-xl font-bold">Workout {workoutType}</h1>
          <div className="w-10" />
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            Exercise {currentExerciseIndex + 1} of {exercises.length}
          </span>
          <span className="text-sm font-medium">
            {exercises.filter((_, i) => i < currentExerciseIndex).length} completed
          </span>
        </div>

        <ExerciseTracker
          exercise={currentExercise}
          onSetComplete={handleSetComplete}
          onWeightChange={handleWeightChange}
        />

        {allSetsComplete && !isLastExercise && (
          <Button
            className="w-full h-14 text-lg font-semibold"
            onClick={() => {
              setCurrentExerciseIndex(currentExerciseIndex + 1);
              toast.success(`${currentExercise.name} completed!`);
            }}
          >
            Next Exercise
          </Button>
        )}

        {allSetsComplete && isLastExercise && (
          <Button
            className="w-full h-14 text-lg font-semibold"
            onClick={() => handleWorkoutComplete(exercises)}
          >
            <Check className="h-5 w-5 mr-2" />
            Finish Workout
          </Button>
        )}
      </main>
    </div>
  );
}

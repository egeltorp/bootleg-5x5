import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ActiveExercise } from '@/types/workout';
import { Check, Minus, Plus, X, Timer } from 'lucide-react';

type ExerciseTrackerProps = {
  exercise: ActiveExercise;
  onSetComplete: (setIndex: number, reps: number, failed?: boolean) => void;
  onWeightChange: (newWeight: number) => void;
};

const useRestTimer = (enabled: boolean, duration: number) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    if (!isActive || timeLeft <= 0) return;

    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setIsActive(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  const startTimer = () => {
    if (enabled) {
      setTimeLeft(duration);
      setIsActive(true);
    }
  };

  const stopTimer = () => {
    setIsActive(false);
    setTimeLeft(0);
  };

  return { timeLeft, isActive, startTimer, stopTimer };
};

export const ExerciseTracker = ({ exercise, onSetComplete, onWeightChange }: ExerciseTrackerProps) => {
  const [currentReps, setCurrentReps] = useState(exercise.reps);
  const [restTimerEnabled, setRestTimerEnabled] = useState(true);
  const [restDuration, setRestDuration] = useState(180); // 3 minutes default
  const [pressCount, setPressCount] = useState(0);
  const { timeLeft, isActive, startTimer, stopTimer } = useRestTimer(restTimerEnabled, restDuration);

  const handleSetComplete = (failed = false) => {
    onSetComplete(exercise.currentSet, currentReps, failed);
    setCurrentReps(exercise.reps);
    setPressCount(0);
    if (!failed) {
      startTimer();
    }
  };

  const handleCompletePress = () => {
    if (pressCount === 0) {
      setPressCount(1);
      setTimeout(() => setPressCount(0), 2000); // Reset after 2 seconds
    } else {
      // Second press - mark as failed
      handleSetComplete(true);
    }

    if (pressCount === 0) {
      handleSetComplete(false);
    }
  };

  const currentSetLog = exercise.setLogs[exercise.currentSet];
  const isSetCompleted = currentSetLog?.completed;

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="text-xl">{exercise.name}</CardTitle>
        <div className="flex items-center justify-between pt-2">
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => onWeightChange(exercise.weight - 5)}
              disabled={exercise.weight <= 0}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="text-2xl font-bold w-20 text-center">{exercise.weight} kg</span>
            <Button
              variant="outline"
              size="icon"
              onClick={() => onWeightChange(exercise.weight + 5)}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
          <div className="flex items-center gap-2">
            <Switch
              checked={restTimerEnabled}
              onCheckedChange={setRestTimerEnabled}
              id="rest-timer"
            />
            <Label htmlFor="rest-timer" className="text-sm">Rest Timer</Label>
          </div>
          {restTimerEnabled && (
            <div className="flex items-center gap-2">
              <Input
                type="number"
                value={restDuration}
                onChange={(e) => setRestDuration(Number(e.target.value))}
                className="w-16 h-8 text-sm"
                min={30}
                max={600}
              />
              <span className="text-xs text-muted-foreground">sec</span>
            </div>
          )}
        </div>

        {isActive && (
          <div className="flex items-center justify-center gap-2 p-4 rounded-lg bg-primary/10 border-2 border-primary">
            <Timer className="h-5 w-5 text-primary" />
            <span className="text-2xl font-bold text-primary">
              {Math.floor(timeLeft / 60)}:{(timeLeft % 60).toString().padStart(2, '0')}
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={stopTimer}
              className="ml-2"
            >
              Skip
            </Button>
          </div>
        )}

        <div className="grid grid-cols-5 gap-2">
          {exercise.setLogs.map((log, index) => (
            <div
              key={index}
              className={`aspect-square rounded-lg flex items-center justify-center font-semibold text-sm border-2 transition-all ${
                log.completed && log.failed
                  ? 'bg-destructive/20 text-destructive border-destructive'
                  : log.completed
                  ? 'bg-success text-success-foreground border-success'
                  : index === exercise.currentSet
                  ? 'border-primary bg-primary/10'
                  : 'border-border bg-muted'
              }`}
            >
              {log.completed ? (log.failed ? <X className="h-5 w-5" /> : <Check className="h-5 w-5" />) : index + 1}
            </div>
          ))}
        </div>

        {!isSetCompleted && exercise.currentSet < exercise.sets && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">Reps</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentReps(Math.max(0, currentReps - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <span className="text-xl font-bold w-12 text-center">{currentReps}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setCurrentReps(currentReps + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Button
              className="w-full h-14 text-lg font-semibold"
              onClick={handleCompletePress}
            >
              {pressCount === 1 ? 'Press Again to Mark Failed' : `Complete Set ${exercise.currentSet + 1}`}
            </Button>
            {pressCount === 1 && (
              <p className="text-xs text-center text-muted-foreground">
                Press again within 2s to mark as failed
              </p>
            )}
          </div>
        )}

        {isSetCompleted && exercise.currentSet < exercise.sets - 1 && (
          <div className="text-center text-sm text-success font-medium py-4">
            ✓ Set {exercise.currentSet + 1} completed! Rest and prepare for the next set.
          </div>
        )}
      </CardContent>
    </Card>
  );
};

import { Exercise, WorkoutType } from '@/types/workout';

export const WORKOUT_A_EXERCISES: Exercise[] = [
  { name: 'Squat', weight: 20, sets: 5, reps: 5 },
  { name: 'Bench Press', weight: 20, sets: 5, reps: 5 },
  { name: 'Barbell Row', weight: 20, sets: 5, reps: 5 },
];

export const WORKOUT_B_EXERCISES: Exercise[] = [
  { name: 'Squat', weight: 20, sets: 5, reps: 5 },
  { name: 'Overhead Press', weight: 20, sets: 5, reps: 5 },
  { name: 'Deadlift', weight: 40, sets: 1, reps: 5 },
];

export const getWorkoutExercises = (type: WorkoutType): Exercise[] => {
  return type === 'A' ? [...WORKOUT_A_EXERCISES] : [...WORKOUT_B_EXERCISES];
};

export const WEIGHT_INCREMENT = 2.5; // kg

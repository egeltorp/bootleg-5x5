import { Workout } from '@/types/workout';

const WORKOUTS_KEY = 'stronglifts_workouts';
const CURRENT_WEIGHTS_KEY = 'stronglifts_current_weights';

export const saveWorkout = (workout: Workout): void => {
  const workouts = getWorkouts();
  workouts.push(workout);
  localStorage.setItem(WORKOUTS_KEY, JSON.stringify(workouts));
};

export const getWorkouts = (): Workout[] => {
  const data = localStorage.getItem(WORKOUTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const getLastWorkout = (): Workout | null => {
  const workouts = getWorkouts();
  return workouts.length > 0 ? workouts[workouts.length - 1] : null;
};

export const saveCurrentWeights = (weights: Record<string, number>): void => {
  localStorage.setItem(CURRENT_WEIGHTS_KEY, JSON.stringify(weights));
};

export const getCurrentWeights = (): Record<string, number> => {
  const data = localStorage.getItem(CURRENT_WEIGHTS_KEY);
  return data ? JSON.parse(data) : {};
};

export const updateExerciseWeight = (exerciseName: string, weight: number): void => {
  const weights = getCurrentWeights();
  weights[exerciseName] = weight;
  saveCurrentWeights(weights);
};

export type Exercise = {
  name: string;
  weight: number;
  sets: number;
  reps: number;
  completed?: boolean;
};

export type WorkoutType = 'A' | 'B';

export type Workout = {
  id: string;
  type: WorkoutType;
  date: string;
  exercises: Exercise[];
  completed: boolean;
};

export type SetLog = {
  set: number;
  reps: number;
  completed: boolean;
  failed?: boolean;
};

export type ActiveExercise = Exercise & {
  setLogs: SetLog[];
  currentSet: number;
};

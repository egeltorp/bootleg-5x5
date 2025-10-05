import { WorkoutType } from '@/types/workout';

// StrongLifts schedule: Monday, Wednesday, Friday
const WORKOUT_DAYS = [1, 3, 5]; // 1 = Monday, 3 = Wednesday, 5 = Friday

export const getNextWorkoutDate = (lastWorkoutDate?: string): Date => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  if (!lastWorkoutDate) {
    // First workout - find next workout day
    return getNextWorkoutDay(today);
  }
  
  const lastDate = new Date(lastWorkoutDate);
  lastDate.setHours(0, 0, 0, 0);
  
  // If last workout was today, next is the following workout day
  if (lastDate.getTime() === today.getTime()) {
    const nextDay = new Date(today);
    nextDay.setDate(nextDay.getDate() + 1);
    return getNextWorkoutDay(nextDay);
  }
  
  // Find next workout day from today
  return getNextWorkoutDay(today);
};

const getNextWorkoutDay = (fromDate: Date): Date => {
  const date = new Date(fromDate);
  const currentDay = date.getDay();
  
  // Find the next workout day
  for (let i = 0; i <= 7; i++) {
    const checkDay = (currentDay + i) % 7;
    if (WORKOUT_DAYS.includes(checkDay)) {
      date.setDate(date.getDate() + i);
      return date;
    }
  }
  
  return date;
};

export const getNextWorkoutType = (lastWorkoutType?: WorkoutType): WorkoutType => {
  return lastWorkoutType === 'A' ? 'B' : 'A';
};

export const formatNextWorkoutDate = (date: Date): string => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(date);
  targetDate.setHours(0, 0, 0, 0);
  
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Tomorrow';
  
  const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  return dayNames[targetDate.getDay()];
};

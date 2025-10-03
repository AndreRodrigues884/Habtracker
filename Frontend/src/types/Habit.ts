// types/Habit.ts

export interface CreateHabitPayload {
  title: string;
  description?: string;
  category: string;
  frequency: string;
  startDate: string;
  endDate?: string;
  intention?: string;
  trigger?: string;
}

export interface HabitUpdate {
  title?: string;
  description?: string;
  category?: string;
  frequency?: string;
  intention?: string;
  trigger?: string;
  endDate?: string;
}

export interface HabitCardProps {
  category: string;
  title: string;
  currentStreak: number;
  isCompleted?: boolean; 
  onComplete?: () => void;
  style?: object;
}

export interface CompleteHabitResponse {
  message: string;
  habit: {
    _id: string;
    title: string;
    category: string;
    currentStreak: number;
    longestStreak: number;
    isCompleted: boolean;
    lastCompletionDate: string | null;
    completedCount: number;
  };
  xpGained: number;
  newLevel: number;
  unlockedAchievements: any[];
}

export interface HabitListProps extends HabitCardProps {
  habitId: string;
  description?: string;
  frequency?: string;
  intention?: string;
  trigger?: string;
  onDeleted?: (habitId: string) => void;
  onHabitUpdated?: (habitId: string, updatedData: any) => void;
}

// Enums para consistência com o backend
export const CategoryEnum = [
  "health",
  "productivity", 
  "learning",
  "creativity",
  "lifestyle",
  "social",
] as const;

export const FrequencyEnum = [
  'daily',
  'weekly',
  'biweekly',
  'twice_per_week',
  'three_times_per_week',
  'four_times_per_week',
  'five_times_per_week',
  'weekends'
] as const;

export type CategoryType = typeof CategoryEnum[number];
export type FrequencyType = typeof FrequencyEnum[number];

export interface Habit {
  _id: string;
  userId: string;
  title: string;
  description?: string;
  category: 'health' | 'productivity' | 'learning' | 'creativity' | 'lifestyle' | 'social';
  frequency: 'daily' | 'weekly' | 'biweekly' | 'twice_per_week' | 'three_times_per_week' | 'four_times_per_week' | 'five_times_per_week' | 'weekends';
  startDate: Date;
  endDate?: Date;
  intention?: string;
  trigger?: string;
  currentStreak: number;
  longestStreak: number;
  isCompleted: boolean;
  lastCompletionDate?: Date;
  completedThisWeek: number;
  completedCount: number;
  weekStartDate?: Date;
  completionDates?: Date[];
  createdAt: Date;
  updatedAt: Date;
}


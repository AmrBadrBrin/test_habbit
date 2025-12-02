export interface User {
  id: string;
  telegram_id: number;
  username?: string;
  first_name?: string;
  created_at: string;
}

export interface Habit {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  icon: string;
  reminder_time?: string;
  target_days?: number;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  completions?: Completion[];
  currentStreak?: number;
}

export interface Completion {
  id: string;
  habit_id: string;
  completed_at: string;
  created_at: string;
}

export interface HabitStats {
  totalCompletions: number;
  completionRate: number;
  currentStreak: number;
  bestStreak: number;
  weeklyData: {
    day: string;
    count: number;
  }[];
}

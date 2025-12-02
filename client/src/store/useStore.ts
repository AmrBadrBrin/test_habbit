import { create } from 'zustand';
import type { User, Habit } from '../types/index.js';

interface AppState {
  user: User | null;
  habits: Habit[];
  isLoading: boolean;
  error: string | null;

  setUser: (user: User | null) => void;
  setHabits: (habits: Habit[]) => void;
  addHabit: (habit: Habit) => void;
  updateHabit: (id: string, updates: Partial<Habit>) => void;
  deleteHabit: (id: string) => void;
  setLoading: (isLoading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useStore = create<AppState>((set) => ({
  user: null,
  habits: [],
  isLoading: false,
  error: null,

  setUser: (user) => set({ user }),

  setHabits: (habits) => set({ habits }),

  addHabit: (habit) =>
    set((state) => ({ habits: [...state.habits, habit] })),

  updateHabit: (id, updates) =>
    set((state) => ({
      habits: state.habits.map((h) =>
        h.id === id ? { ...h, ...updates } : h
      ),
    })),

  deleteHabit: (id) =>
    set((state) => ({
      habits: state.habits.filter((h) => h.id !== id),
    })),

  setLoading: (isLoading) => set({ isLoading }),

  setError: (error) => set({ error }),
}));

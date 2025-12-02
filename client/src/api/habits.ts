import { apiClient } from './client';
import type { Habit, HabitStats } from '../types/index.js';

export const habitsApi = {
  getAll: () => apiClient.get<Habit[]>('/habits'),

  getById: (id: string) => apiClient.get<Habit>(`/habits/${id}`),

  create: (data: Omit<Habit, 'id' | 'user_id' | 'created_at' | 'updated_at' | 'is_archived'>) =>
    apiClient.post<Habit>('/habits', data),

  update: (id: string, data: Partial<Habit>) =>
    apiClient.put<Habit>(`/habits/${id}`, data),

  delete: (id: string) =>
    apiClient.delete<void>(`/habits/${id}`),

  complete: (id: string) =>
    apiClient.post<void>(`/habits/${id}/complete`, {}),

  uncomplete: (id: string, date: string) =>
    apiClient.delete<void>(`/habits/${id}/complete/${date}`),

  getCompletions: (id: string) =>
    apiClient.get<any[]>(`/habits/${id}/completions`),

  getStats: (id: string) =>
    apiClient.get<HabitStats>(`/habits/${id}/stats`),
};

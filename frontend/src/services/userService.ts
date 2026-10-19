import { api } from './api';
import { User, MatchResult } from '../types';

export const userService = {
  getProfile: async (id: string): Promise<User> => {
    const res = await api.get<User>(`/users/${id}`);
    return res.data;
  },

  updateProfile: async (id: string, updates: Partial<User>): Promise<User> => {
    const res = await api.put<User>(`/users/${id}`, updates);
    return res.data;
  },

  searchUsers: async (skill?: string): Promise<User[]> => {
    const url = skill ? `/users/search?skill=${encodeURIComponent(skill)}` : '/users/search';
    const res = await api.get<User[]>(url);
    return res.data;
  },

  getMatches: async (userId: string, skill?: string): Promise<MatchResult[]> => {
    const url = skill
      ? `/users/${userId}/matches?skill=${encodeURIComponent(skill)}`
      : `/users/${userId}/matches`;
    const res = await api.get<MatchResult[]>(url);
    return res.data;
  },
};

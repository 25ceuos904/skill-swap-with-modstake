import { api } from './api';
import { AuthResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/login', { email, password });
    return res.data;
  },

  register: async (userData: {
    name: string;
    email: string;
    password: string;
    skillsOffered?: string[];
    skillsWanted?: string[];
    bio?: string;
    education?: string;
  }): Promise<AuthResponse> => {
    const res = await api.post<AuthResponse>('/auth/register', userData);
    return res.data;
  },
};

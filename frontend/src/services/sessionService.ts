import { api } from './api';
import { Session, SessionStatus } from '../types';

export const sessionService = {
  createSession: async (data: {
    recipientId: string;
    scheduledTime?: string;
    meetingLink?: string;
  }): Promise<Session> => {
    const res = await api.post<Session>('/sessions', data);
    return res.data;
  },

  getUserSessions: async (userId: string): Promise<Session[]> => {
    const res = await api.get<Session[]>(`/sessions/user/${userId}`);
    return res.data;
  },

  updateSessionStatus: async (
    sessionId: string,
    status: SessionStatus,
    scheduledTime?: string,
    meetingLink?: string
  ): Promise<Session> => {
    const res = await api.patch<Session>(`/sessions/${sessionId}/status`, {
      status,
      ...(scheduledTime && { scheduledTime }),
      ...(meetingLink !== undefined && { meetingLink }),
    });
    return res.data;
  },
};

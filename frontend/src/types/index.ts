export interface User {
  _id: string;
  name: string;
  email: string;
  skillsOffered: string[];
  skillsWanted: string[];
  bio?: string;
  education?: string;
  points: number;
  createdAt?: string;
}

export type SessionStatus = 'requested' | 'confirmed' | 'completed' | 'rejected';

export interface Session {
  _id: string;
  requesterId: User | string;
  recipientId: User | string;
  status: SessionStatus;
  scheduledTime?: string;
  meetingLink?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Resource {
  _id: string;
  userId: User | string;
  title: string;
  description?: string;
  link: string;
  tags: string[];
  createdAt?: string;
}

export interface MatchResult {
  user: User;
  mutualScore: number;
  aOffersToB: string[];
  bOffersToA: string[];
}

export interface PortfolioData {
  user: User;
  skillsLearned: string[];
  skillsTaught: string[];
  completedSessions: Session[];
  sharedResources: Resource[];
  totalPoints: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}

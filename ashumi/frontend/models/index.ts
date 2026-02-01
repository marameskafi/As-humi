export interface User {
  id: string;
  email: string;
  name: string;
}

export interface FamilyMember {
  id: string;
  name: string;
  contributionAmount: number;
  userId: string;
}

export interface ContributionPlan {
  id: string;
  name: string;
  totalAmount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
  userId: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}

export interface LoadingState {
  isLoading: boolean;
  error: string | null;
}
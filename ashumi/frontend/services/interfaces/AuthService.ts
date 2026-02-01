import { User, ApiResponse } from '../../models';

export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
}

export interface AuthService {
  signIn(request: SignInRequest): Promise<ApiResponse<User>>;
  signUp(request: SignUpRequest): Promise<ApiResponse<User>>;
  signOut(): Promise<ApiResponse<void>>;
  getCurrentUser(): Promise<ApiResponse<User | null>>;
}
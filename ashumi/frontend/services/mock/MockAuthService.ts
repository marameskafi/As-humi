import { AuthService, SignInRequest, SignUpRequest } from '../interfaces/AuthService';
import { User, ApiResponse } from '../../models';

export class MockAuthService implements AuthService {
  private currentUser: User | null = null;

  async signIn(request: SignInRequest): Promise<ApiResponse<User>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Mock validation
    if (request.email === 'test@example.com' && request.password === 'password') {
      this.currentUser = {
        id: '1',
        email: request.email,
        name: 'Test User',
      };
      return {
        data: this.currentUser,
        success: true,
      };
    }

    return {
      data: {} as User,
      success: false,
      message: 'Invalid credentials',
    };
  }

  async signUp(request: SignUpRequest): Promise<ApiResponse<User>> {
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.currentUser = {
      id: Math.random().toString(36).substr(2, 9),
      email: request.email,
      name: request.name,
    };

    return {
      data: this.currentUser,
      success: true,
    };
  }

  async signOut(): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    this.currentUser = null;
    return {
      data: undefined,
      success: true,
    };
  }

  async getCurrentUser(): Promise<ApiResponse<User | null>> {
    return {
      data: this.currentUser,
      success: true,
    };
  }
}
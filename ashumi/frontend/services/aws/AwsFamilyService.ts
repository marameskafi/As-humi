import { FamilyService, CreateMemberRequest, UpdateMemberRequest } from '../interfaces/FamilyService';
import { FamilyMember, ApiResponse } from '../../models';

export class AwsFamilyService implements FamilyService {
  private apiUrl: string;

  constructor() {
    this.apiUrl = process.env.EXPO_PUBLIC_API_URL || '';
  }

  private async makeRequest<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    // This would include JWT token from Cognito in Authorization header
    const token = ''; // Get from secure storage or auth context
    
    const response = await fetch(`${this.apiUrl}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    return response.json();
  }

  async getMembers(): Promise<ApiResponse<FamilyMember[]>> {
    return this.makeRequest<FamilyMember[]>('/members');
  }

  async createMember(request: CreateMemberRequest): Promise<ApiResponse<FamilyMember>> {
    return this.makeRequest<FamilyMember>('/members', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updateMember(request: UpdateMemberRequest): Promise<ApiResponse<FamilyMember>> {
    return this.makeRequest<FamilyMember>(`/members/${request.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: request.name,
        contributionAmount: request.contributionAmount,
      }),
    });
  }

  async deleteMember(id: string): Promise<ApiResponse<void>> {
    return this.makeRequest<void>(`/members/${id}`, {
      method: 'DELETE',
    });
  }
}
import { PlanService, CreatePlanRequest, UpdatePlanRequest } from '../interfaces/PlanService';
import { ContributionPlan, ApiResponse } from '../../models';

export class AwsPlanService implements PlanService {
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

  async getPlans(): Promise<ApiResponse<ContributionPlan[]>> {
    return this.makeRequest<ContributionPlan[]>('/plans');
  }

  async createPlan(request: CreatePlanRequest): Promise<ApiResponse<ContributionPlan>> {
    return this.makeRequest<ContributionPlan>('/plans', {
      method: 'POST',
      body: JSON.stringify(request),
    });
  }

  async updatePlan(request: UpdatePlanRequest): Promise<ApiResponse<ContributionPlan>> {
    return this.makeRequest<ContributionPlan>(`/plans/${request.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        name: request.name,
        totalAmount: request.totalAmount,
        frequency: request.frequency,
      }),
    });
  }
}
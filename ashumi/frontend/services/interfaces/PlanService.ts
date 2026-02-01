import { ContributionPlan, ApiResponse } from '../../models';

export interface CreatePlanRequest {
  name: string;
  totalAmount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
}

export interface UpdatePlanRequest {
  id: string;
  name: string;
  totalAmount: number;
  frequency: 'monthly' | 'weekly' | 'yearly';
}

export interface PlanService {
  getPlans(): Promise<ApiResponse<ContributionPlan[]>>;
  createPlan(request: CreatePlanRequest): Promise<ApiResponse<ContributionPlan>>;
  updatePlan(request: UpdatePlanRequest): Promise<ApiResponse<ContributionPlan>>;
}
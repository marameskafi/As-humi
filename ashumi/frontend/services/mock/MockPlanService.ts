import { PlanService, CreatePlanRequest, UpdatePlanRequest } from '../interfaces/PlanService';
import { ContributionPlan, ApiResponse } from '../../models';

export class MockPlanService implements PlanService {
  private plans: ContributionPlan[] = [
    {
      id: '1',
      name: 'Family Savings Plan',
      totalAmount: 1000,
      frequency: 'monthly',
      userId: '1',
    },
  ];

  async getPlans(): Promise<ApiResponse<ContributionPlan[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [...this.plans],
      success: true,
    };
  }

  async createPlan(request: CreatePlanRequest): Promise<ApiResponse<ContributionPlan>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newPlan: ContributionPlan = {
      id: Math.random().toString(36).substr(2, 9),
      name: request.name,
      totalAmount: request.totalAmount,
      frequency: request.frequency,
      userId: '1',
    };

    this.plans.push(newPlan);

    return {
      data: newPlan,
      success: true,
    };
  }

  async updatePlan(request: UpdatePlanRequest): Promise<ApiResponse<ContributionPlan>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const planIndex = this.plans.findIndex(p => p.id === request.id);
    if (planIndex === -1) {
      return {
        data: {} as ContributionPlan,
        success: false,
        message: 'Plan not found',
      };
    }

    this.plans[planIndex] = {
      ...this.plans[planIndex],
      name: request.name,
      totalAmount: request.totalAmount,
      frequency: request.frequency,
    };

    return {
      data: this.plans[planIndex],
      success: true,
    };
  }
}
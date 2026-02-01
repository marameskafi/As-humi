import { FamilyService, CreateMemberRequest, UpdateMemberRequest } from '../interfaces/FamilyService';
import { FamilyMember, ApiResponse } from '../../models';

export class MockFamilyService implements FamilyService {
  private members: FamilyMember[] = [
    {
      id: '1',
      name: 'John Doe',
      contributionAmount: 500,
      userId: '1',
    },
    {
      id: '2',
      name: 'Jane Doe',
      contributionAmount: 300,
      userId: '1',
    },
  ];

  async getMembers(): Promise<ApiResponse<FamilyMember[]>> {
    await new Promise(resolve => setTimeout(resolve, 500));
    return {
      data: [...this.members],
      success: true,
    };
  }

  async createMember(request: CreateMemberRequest): Promise<ApiResponse<FamilyMember>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const newMember: FamilyMember = {
      id: Math.random().toString(36).substr(2, 9),
      name: request.name,
      contributionAmount: request.contributionAmount,
      userId: '1',
    };

    this.members.push(newMember);

    return {
      data: newMember,
      success: true,
    };
  }

  async updateMember(request: UpdateMemberRequest): Promise<ApiResponse<FamilyMember>> {
    await new Promise(resolve => setTimeout(resolve, 800));

    const memberIndex = this.members.findIndex(m => m.id === request.id);
    if (memberIndex === -1) {
      return {
        data: {} as FamilyMember,
        success: false,
        message: 'Member not found',
      };
    }

    this.members[memberIndex] = {
      ...this.members[memberIndex],
      name: request.name,
      contributionAmount: request.contributionAmount,
    };

    return {
      data: this.members[memberIndex],
      success: true,
    };
  }

  async deleteMember(id: string): Promise<ApiResponse<void>> {
    await new Promise(resolve => setTimeout(resolve, 500));

    const memberIndex = this.members.findIndex(m => m.id === id);
    if (memberIndex === -1) {
      return {
        data: undefined,
        success: false,
        message: 'Member not found',
      };
    }

    this.members.splice(memberIndex, 1);

    return {
      data: undefined,
      success: true,
    };
  }
}
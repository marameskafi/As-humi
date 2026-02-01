import { FamilyMember, ApiResponse } from '../../models';

export interface CreateMemberRequest {
  name: string;
  contributionAmount: number;
}

export interface UpdateMemberRequest {
  id: string;
  name: string;
  contributionAmount: number;
}

export interface FamilyService {
  getMembers(): Promise<ApiResponse<FamilyMember[]>>;
  createMember(request: CreateMemberRequest): Promise<ApiResponse<FamilyMember>>;
  updateMember(request: UpdateMemberRequest): Promise<ApiResponse<FamilyMember>>;
  deleteMember(id: string): Promise<ApiResponse<void>>;
}
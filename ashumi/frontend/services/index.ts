// Import mock implementations
import { MockAuthService } from './mock/MockAuthService';
import { MockFamilyService } from './mock/MockFamilyService';
import { MockPlanService } from './mock/MockPlanService';
import { MockChatService } from './mock/MockChatService';

// Import interfaces
import { AuthService } from './interfaces/AuthService';
import { FamilyService } from './interfaces/FamilyService';
import { PlanService } from './interfaces/PlanService';
import { ChatService } from './interfaces/ChatService';

// TODO: Import AWS implementations when backend is deployed
// import { AwsAuthService } from './aws/AwsAuthService';
// import { AwsFamilyService } from './aws/AwsFamilyService';
// import { AwsPlanService } from './aws/AwsPlanService';
// import { AwsChatService } from './aws/AwsChatService';

// Configuration flag - change this to switch between mock and AWS services
const USE_AWS_SERVICES = false;

// Export active service implementations
export const authService: AuthService = USE_AWS_SERVICES 
  ? new MockAuthService() // Replace with: new AwsAuthService()
  : new MockAuthService();

export const familyService: FamilyService = USE_AWS_SERVICES
  ? new MockFamilyService() // Replace with: new AwsFamilyService()
  : new MockFamilyService();

export const planService: PlanService = USE_AWS_SERVICES
  ? new MockPlanService() // Replace with: new AwsPlanService()
  : new MockPlanService();

export const chatService: ChatService = USE_AWS_SERVICES
  ? new MockChatService() // Replace with: new AwsChatService()
  : new MockChatService();

// Re-export interfaces for use in components
export type { AuthService, FamilyService, PlanService, ChatService };
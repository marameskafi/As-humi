import { ChatService, SendMessageRequest } from '../interfaces/ChatService';
import { ChatMessage, ApiResponse } from '../../models';

export class MockChatService implements ChatService {
  private mockResponses = [
    "That's a great question about family financial planning! Remember, this is educational information only and not financial advice.",
    "Family contribution plans can help teach children about saving and financial responsibility. Consider starting with small, achievable goals.",
    "It's important to involve all family members in financial discussions appropriate to their age and understanding.",
    "Regular family meetings about finances can help everyone stay on track with your savings goals.",
    "Remember to review and adjust your contribution plans as your family's needs change over time.",
  ];

  async sendMessage(request: SendMessageRequest): Promise<ApiResponse<ChatMessage>> {
    await new Promise(resolve => setTimeout(resolve, 1500));

    const randomResponse = this.mockResponses[Math.floor(Math.random() * this.mockResponses.length)];

    const response: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      text: randomResponse,
      isUser: false,
      timestamp: new Date(),
    };

    return {
      data: response,
      success: true,
    };
  }
}
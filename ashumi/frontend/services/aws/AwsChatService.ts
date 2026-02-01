import { ChatService, SendMessageRequest } from '../interfaces/ChatService';
import { ChatMessage, ApiResponse } from '../../models';

export class AwsChatService implements ChatService {
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

  async sendMessage(request: SendMessageRequest): Promise<ApiResponse<ChatMessage>> {
    return this.makeRequest<ChatMessage>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message: request.message }),
    });
  }
}
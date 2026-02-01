import { ChatMessage, ApiResponse } from '../../models';

export interface SendMessageRequest {
  message: string;
}

export interface ChatService {
  sendMessage(request: SendMessageRequest): Promise<ApiResponse<ChatMessage>>;
}
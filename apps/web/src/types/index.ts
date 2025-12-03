export interface Message {
  id: string;
  content: string;
  isUser: boolean;
}

export interface Conversation {
  id: string;
  user_id: number;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ApiMessage {
  id: string;
  conversation_id: string;
  user_prompt: string;
  bot_response: string;
  timestamp: string;
}

export interface ConversationDetail extends Conversation {
  messages: ApiMessage[];
}

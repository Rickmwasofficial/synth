
export interface Step {
  step_name: string;
  payload: Record<string, any>;
}

export interface BotMessageData {
  finalAnswer?: string;
  toolsUsed?: string[];
  steps: Step[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string | BotMessageData;
}

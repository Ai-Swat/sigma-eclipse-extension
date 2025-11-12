// Types and constants for background service worker

export interface PageContext {
  url: string;
  title: string;
  content: string;
  selectedText?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

export interface ChatRequest {
  message: string;
  includeContext?: boolean;
  history?: ChatMessage[];
}

export interface ChatResponse {
  message: string;
  error?: string;
}

export const MessageType = {
  GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
  TRANSLATE_TEXT: 'TRANSLATE_TEXT',
  CHAT_REQUEST: 'CHAT_REQUEST',
  CHAT_RESPONSE: 'CHAT_RESPONSE',
  SUMMARIZE_PAGE: 'SUMMARIZE_PAGE',
  ERROR: 'ERROR',
} as const;

export type MessageTypeKeys = keyof typeof MessageType;

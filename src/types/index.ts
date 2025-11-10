// Message types for communication between components
export enum MessageType {
  GET_PAGE_CONTEXT = 'GET_PAGE_CONTEXT',
  TRANSLATE_TEXT = 'TRANSLATE_TEXT',
  CHAT_REQUEST = 'CHAT_REQUEST',
  CHAT_RESPONSE = 'CHAT_RESPONSE',
  ERROR = 'ERROR'
}

export interface Message {
  type: MessageType;
  payload?: any;
}

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

export interface TranslationRequest {
  text: string;
  sourceLang?: string;
  targetLang: string;
}

export interface TranslationResponse {
  translatedText: string;
  sourceLang: string;
  targetLang: string;
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


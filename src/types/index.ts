// Message types for communication between components
export const MessageType = {
  GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
  TRANSLATE_TEXT: 'TRANSLATE_TEXT',
  CHAT_REQUEST: 'CHAT_REQUEST',
  CHAT_RESPONSE: 'CHAT_RESPONSE',
  SUMMARIZE_PAGE: 'SUMMARIZE_PAGE',
  ERROR: 'ERROR',
} as const;

export type MessageType = typeof MessageType[keyof typeof MessageType];

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

// Chat Message - single message in a chat
export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  // Metadata for summarization messages
  isSummarization?: boolean;
  summarizationPreview?: string; // Short preview text or URL to show on collapsed banner
  // Flag for aborted generation
  isAborted?: boolean;
}

// Chat - dialog entity
export interface Chat {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
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

// Note: LlamaCpp API integration now uses OpenAI library
// See src/utils/api.ts for implementation


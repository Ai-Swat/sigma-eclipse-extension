// Store types for Sigma Private Extension

export enum FollowUpType {
  AUTO = 'auto',
  SEARCH = 'web-search',
  CHAT = 'text-chat',
  CHAT_EXTENSION = 'text-chat',
  TEXT_GENERATOR = 'text-generation',
  IMAGE = 'image-generation',
  TELEGRAM = 'tg-search',
  DEEP_RESEARCH = 'deep-research',
  WEB_AGENT = 'web-agent',
}

export interface TypeFollowUp {
  id: string;
  parent_id?: string;
  query_type: FollowUpType;
  text?: string;
  created_at?: string;
  was_panel_used?: boolean;
}



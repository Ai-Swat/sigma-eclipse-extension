// Types for content script

export interface PageContext {
  url: string;
  title: string;
  content: string;
  selectedText?: string;
}

export interface TranslationState {
  bubble: HTMLElement | null;
  popup: HTMLElement | null;
  selectedText: string;
  mouseUpTimeout: number | null;
}


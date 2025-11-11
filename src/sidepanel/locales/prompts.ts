// Language configuration for AI interactions
export type SupportedLanguage = 'en' | 'de' | 'es' | 'fr' | 'ja' | 'pt' | 'ar' | 'cs' | 'it' | 'ko' | 'nl' | 'zh' | 'ru';

// Language code to display name mapping
export const LANGUAGE_NAMES: Record<SupportedLanguage, string> = {
  en: 'EN',
  de: 'DE',
  es: 'ES',
  fr: 'FR',
  ja: 'JA',
  pt: 'PT',
  ar: 'AR',
  cs: 'CS',
  it: 'IT',
  ko: 'KO',
  nl: 'NL',
  zh: 'ZH',
  ru: 'RU',
};

// Language code to full language name mapping
export const LANGUAGE_FULL_NAMES: Record<SupportedLanguage, string> = {
  en: 'English',
  de: 'German',
  es: 'Spanish',
  fr: 'French',
  ja: 'Japanese',
  pt: 'Portuguese',
  ar: 'Arabic',
  cs: 'Czech',
  it: 'Italian',
  ko: 'Korean',
  nl: 'Dutch',
  zh: 'Chinese',
  ru: 'Russian',
};

// Get summarization prompt for a specific language
export function getSummarizationPrompt(language: SupportedLanguage): string {
  const languageName = LANGUAGE_FULL_NAMES[language];
  return `Provide a brief summary of the following text, highlighting the key points, main ideas, and important details. PLEASE RESPOND IN ${languageName}:`;
}

// Get system prompt for a specific language
export function getSystemPrompt(language: SupportedLanguage): string {
  const languageName = LANGUAGE_FULL_NAMES[language];
  return `You are a helpful AI assistant. Always format your responses using Markdown syntax. PLEASE RESPOND IN ${languageName}.`;
}

// Helper function to get browser language
export function getBrowserLanguage(): SupportedLanguage {
  const browserLang = navigator.language.toLowerCase();
  
  // Map browser language codes to supported languages
  if (browserLang.startsWith('en')) return 'en';
  if (browserLang.startsWith('de')) return 'de';
  if (browserLang.startsWith('es')) return 'es';
  if (browserLang.startsWith('fr')) return 'fr';
  if (browserLang.startsWith('ja')) return 'ja';
  if (browserLang.startsWith('pt')) return 'pt';
  if (browserLang.startsWith('ar')) return 'ar';
  if (browserLang.startsWith('cs')) return 'cs';
  if (browserLang.startsWith('it')) return 'it';
  if (browserLang.startsWith('ko')) return 'ko';
  if (browserLang.startsWith('nl')) return 'nl';
  if (browserLang.startsWith('zh')) return 'zh';
  if (browserLang.startsWith('ru')) return 'ru';
  
  // Default to English if language is not supported
  return 'en';
}


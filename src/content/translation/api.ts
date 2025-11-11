// Translation API utilities

/**
 * Translate text via background script with streaming support
 */
export async function translateTextViaBackground(text: string, targetLanguage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      // Check if chrome.runtime is available
      if (typeof chrome === 'undefined' || !chrome.runtime) {
        reject(new Error('Chrome extension API not available. Please reload the page.'));
        return;
      }
      
      chrome.runtime.sendMessage(
        {
          type: 'TRANSLATE_TEXT',
          text,
          targetLanguage
        },
        (response) => {
          // Check for chrome.runtime.lastError (extension context invalidated)
          if (chrome.runtime.lastError) {
            console.error('❌ Chrome runtime error:', chrome.runtime.lastError);
            reject(new Error('Extension was updated. Please reload the page to use translation.'));
            return;
          }
          
          if (response && response.success) {
            resolve(response.translation);
          } else {
            reject(new Error(response?.error || 'Translation failed'));
          }
        }
      );
    } catch (error) {
      console.error('❌ Error sending message:', error);
      reject(new Error('Extension was updated. Please reload the page to use translation.'));
    }
  });
}

/**
 * Get target language from extension storage
 */
export async function getTargetLanguage(): Promise<string> {
  try {
    // Check if chrome.storage is available
    if (typeof chrome === 'undefined' || !chrome.storage) {
      console.warn('Chrome storage API not available, using default language');
      return 'en';
    }
    
    const result = await chrome.storage.local.get('app_language');
    return result.app_language || 'en';
  } catch (error) {
    console.error('Error getting target language:', error);
    return 'en';
  }
}

/**
 * Language names mapping
 */
export const LANGUAGE_NAMES: Record<string, string> = {
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
  ru: 'Russian'
};


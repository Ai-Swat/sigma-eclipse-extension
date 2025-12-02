// Translation popup component

import { translateTextViaBackground, getTargetLanguage, LANGUAGE_NAMES } from './api';
import { escapeHtml } from '../utils';
import { removeTranslationBubble } from './bubble';

let translationPopup: HTMLElement | null = null;
let currentSelectedText = '';

/**
 * Set current selected text for translation
 */
export function setCurrentSelectedText(text: string): void {
  currentSelectedText = text;
}

/**
 * Get current selected text
 */
export function getCurrentSelectedText(): string {
  return currentSelectedText;
}

/**
 * Show translation popup with original text and translation
 */
export async function showTranslationPopup(): Promise<void> {
  // console.log('🔄 showTranslationPopup called, text:', currentSelectedText);

  // Force remove bubble immediately
  removeTranslationBubble();

  if (!currentSelectedText) {
    // console.log('❌ No text selected');
    return;
  }

  // Get target language from extension storage
  const targetLanguage = await getTargetLanguage();
  // console.log('🌍 Target language:', targetLanguage);

  const targetLanguageName = LANGUAGE_NAMES[targetLanguage] || 'English';

  const startTranslation = async (selectedLang: string) => {
    const selectorEl = popup.querySelector('#sigma-language-selector') as HTMLSelectElement;

    // Disable selector while translating
    if (selectorEl) selectorEl.disabled = true;

    try {
      // console.log('📤 Sending translation request...');
      const translationResult = await translateTextViaBackground(currentSelectedText, selectedLang);
      // console.log('✅ Translation received:', translationResult);

      const resultBox = document.getElementById('sigma-translation-result');
      if (resultBox) {
        resultBox.innerHTML = escapeHtml(translationResult);
      }
    } catch (error) {
      console.error('❌ Translation error:', error);
      const resultBox = document.getElementById('sigma-translation-result');
      if (resultBox) {
        const errorMessage = error instanceof Error ? error.message : 'Translation failed';

        if (errorMessage.includes('reload the page')) {
          resultBox.innerHTML = `<div class="sigma-translate-error"><span>⚠️</span>️️ Extension was updated. Please <strong>reload the page</strong> (F5) to use translation.</div>`;
        } else if (errorMessage.includes('LlamaCpp')) {
          resultBox.innerHTML = `<div class="sigma-translate-error"><span>❌</span>️️ Translation failed. Please make sure LlamaCpp is running on port 10345.</div>`;
        } else {
          resultBox.innerHTML = `<div class="sigma-translate-error"><span>❌</span>️️ ${escapeHtml(errorMessage)}</div>`;
        }
      }
    } finally {
      // Re-enable selector after translation is finished
      if (selectorEl) selectorEl.disabled = false;
    }
  };

  document.body.classList.add('sigma-no-scroll');

  // Create popup overlay
  const overlay = document.createElement('div');
  overlay.className = 'sigma-translate-popup-overlay';

  // Create popup
  const popup = document.createElement('div');
  popup.className = 'sigma-translate-popup';

  popup.innerHTML = `
  <div class="sigma-translate-popup-container">
      <div class="sigma-translate-popup-header">
          <div class="sigma-translate-popup-title">Translation</div>
          <button class="sigma-translate-popup-close">×</button>
      </div>

      <div class="sigma-translate-section">
          <div class="sigma-translate-section-title">Original Text</div>
          <div class="sigma-translate-text-box">${escapeHtml(currentSelectedText)}</div>
      </div>

      <div class="sigma-translate-section">
          <div class="sigma-translate-section-title">
            Translation
            <select id="sigma-language-selector" class="sigma-language-selector">
              ${Object.entries(LANGUAGE_NAMES)
                ?.map(([code, name]) => {
                  const selected = code === targetLanguage ? 'selected' : '';
                  return `<option value="${code}" ${selected}>${name}</option>`;
                })
                ?.join('')}
            </select>
          </div>
          <div class="sigma-translate-text-box" id="sigma-translation-result">
              <div class="sigma-translate-loading">
                  <div class="sigma-translate-spinner"></div>
                  <div>Translating...</div>
              </div>
          </div>
      </div>
  </div>
`;

  overlay.appendChild(popup);
  document.body.appendChild(overlay);
  translationPopup = overlay;

  // Handle language change
  const selector = popup.querySelector('#sigma-language-selector') as HTMLSelectElement;
  selector?.addEventListener('change', async () => {
    const newLang = selector.value;
    // console.log('🌐 Language changed:', newLang);

    // Save chosen language (if you have such API)
    if (typeof chrome !== 'undefined') {
      chrome.storage.sync.set({ targetLanguage: newLang });
    }

    const newLangName = LANGUAGE_NAMES[newLang];

    const resultBox = document.getElementById('sigma-translation-result');
    if (resultBox) {
      resultBox.innerHTML = `
      <div class="sigma-translate-loading">
          <div class="sigma-translate-spinner"></div>
          <div>Translating...</div>
      </div>
    `;
    }

    void startTranslation(newLangName);
  });

  // Close button handler
  const closeBtn = popup.querySelector('.sigma-translate-popup-close');
  closeBtn?.addEventListener('click', removeTranslationPopup);

  // Close on overlay click
  overlay.addEventListener('click', e => {
    if (e.target === overlay) {
      removeTranslationPopup();
    }
  });

  void startTranslation(targetLanguageName);
}

/**
 * Remove translation popup from DOM
 */
export function removeTranslationPopup(): void {
  if (translationPopup) {
    translationPopup.remove();
    translationPopup = null;
  }
  document.body.classList.remove('sigma-no-scroll');
}

/**
 * Update translation result in real-time (for streaming)
 */
export function updateTranslationResult(fullText: string): void {
  const resultBox = document.getElementById('sigma-translation-result');
  if (resultBox) {
    resultBox.textContent = fullText;
  }
}

// Content script for Sigma Private - runs on all web pages

// Prevent multiple injections
if ((window as any).__SIGMA_PRIVATE_CONTENT_SCRIPT_LOADED__) {
  console.log('⚠️ Sigma Private content script already loaded, skipping');
} else {
  (window as any).__SIGMA_PRIVATE_CONTENT_SCRIPT_LOADED__ = true;
  console.log('✅ Sigma Private content script loaded');
}

// Local types (inlined to avoid bundler creating shared chunks)
interface PageContext {
  url: string;
  title: string;
  content: string;
  selectedText?: string;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Content script received message:', message.type);
  
  if (message.type === 'GET_PAGE_CONTEXT') {
    try {
      const context = getPageContext();
      console.log('✅ Sending page context:', {
        url: context.url,
        title: context.title,
        contentLength: context.content.length,
        hasSelection: !!context.selectedText
      });
      sendResponse(context);
    } catch (error) {
      console.error('❌ Error getting page context:', error);
      sendResponse(null);
    }
    return true;
  }
  
  if (message.type === 'TRANSLATION_CHUNK') {
    // Update translation result in real-time
    const resultBox = document.getElementById('sigma-translation-result');
    if (resultBox) {
      resultBox.textContent = message.fullText;
    }
    return true;
  }
});

function getPageContext(): PageContext {
  // Get page title
  const title = document.title;
  
  // Get page URL
  const url = window.location.href;
  
  // Get main text content
  const content = extractMainContent();
  
  // Get selected text if any
  const selectedText = window.getSelection()?.toString() || undefined;

  return {
    url,
    title,
    content,
    selectedText
  };
}

function extractMainContent(): string {
  // Try to get main content from common elements
  const mainElements = [
    document.querySelector('main'),
    document.querySelector('article'),
    document.querySelector('[role="main"]'),
    document.querySelector('.content'),
    document.querySelector('#content'),
    document.body
  ];

  let content = '';

  for (const element of mainElements) {
    if (element) {
      content = extractTextFromElement(element);
      if (content.length > 100) break; // Found substantial content
    }
  }

  return content.substring(0, 10000); // Limit to 5000 chars
}

function extractTextFromElement(element: Element): string {
  // Clone the element to avoid modifying the actual DOM
  const clone = element.cloneNode(true) as Element;

  // Remove script, style, and other non-content elements
  const elementsToRemove = clone.querySelectorAll('script, style, nav, header, footer, aside, noscript, iframe');
  elementsToRemove.forEach(el => el.remove());

  // Get text content and clean it up
  let text = clone.textContent || '';
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// ============================================================================
// TRANSLATION BUBBLE & POPUP
// ============================================================================

let translationBubble: HTMLElement | null = null;
let translationPopup: HTMLElement | null = null;
let currentSelectedText = '';

// Inject styles for translation UI
function injectTranslationStyles() {
  if (document.getElementById('sigma-translation-styles')) return;
  
  const style = document.createElement('style');
  style.id = 'sigma-translation-styles';
  style.textContent = `
    .sigma-translate-bubble {
      position: absolute;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999990;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      transition: all 0.2s ease;
      user-select: none;
      pointer-events: auto;
    }
    
    .sigma-translate-bubble:hover {
      transform: scale(1.1);
      box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
    }
    
    .sigma-translate-bubble svg {
      width: 22px;
      height: 22px;
      fill: white;
    }
    
    .sigma-translate-popup-overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(4px);
    }
    
    .sigma-translate-popup {
      background: white;
      border-radius: 16px;
      padding: 24px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      z-index: 9999999;
      font-family: -apple-system, system-ui, Helvetica, Arial;
    }
    
    .sigma-translate-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    
    .sigma-translate-popup-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
    }
    
    .sigma-translate-popup-close {
      background: #f5f5f5;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;
    }
    
    .sigma-translate-popup-close:hover {
      background: #e5e5e5;
      color: #333;
    }
    
    .sigma-translate-section {
      margin-bottom: 20px;
    }
    
    .sigma-translate-section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }
    
    .sigma-translate-text-box {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      font-size: 15px;
      line-height: 1.6;
      color: #333;
      border: 1px solid #e0e0e0;
    }
    
    .sigma-translate-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }
    
    .sigma-translate-spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: sigma-spin 1s linear infinite;
      margin-bottom: 12px;
    }
    
    @keyframes sigma-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    .sigma-translate-error {
      background: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
    }
  `;
  
  document.head.appendChild(style);
}

// Create translation bubble
function createTranslationBubble(x: number, y: number): HTMLElement {
  const bubble = document.createElement('div');
  bubble.className = 'sigma-translate-bubble';
  
  // SVG icon with hieroglyph (文) and letter (A)
  bubble.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  `;
  
  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  bubble.style.position = 'absolute';
  bubble.style.zIndex = '9999990';
  
  bubble.addEventListener('click', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
    console.log('🌐 Translation bubble clicked');
    removeTranslationBubble(); // Remove bubble first
    showTranslationPopup();
  }, true);
  
  bubble.addEventListener('mousedown', (e) => {
    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();
  }, true);
  
  return bubble;
}

// Show translation bubble on text selection
function showTranslationBubble(mouseX: number, mouseY: number) {
  console.log('🎯 showTranslationBubble called');
  const selection = window.getSelection();
  const selectedText = selection?.toString().trim();
  
  console.log('📋 Selected text:', selectedText);
  
  if (!selectedText || selectedText.length === 0) {
    console.log('⚠️ No text selected, removing bubble');
    removeTranslationBubble();
    return;
  }
  
  currentSelectedText = selectedText;
  
  // Remove existing bubble
  removeTranslationBubble();
  
  // Create and position bubble
  const range = selection!.getRangeAt(0);
  const rect = range.getBoundingClientRect();
  
  const x = rect.left + (rect.width / 2) - 50 + window.scrollX;
  const y = rect.bottom + 10 + window.scrollY;
  
  console.log('📍 Bubble position:', { x, y });
  
  translationBubble = createTranslationBubble(x, y);
  document.body.appendChild(translationBubble);
  
  console.log('✅ Translation bubble added to DOM', translationBubble);
}

// Remove translation bubble
function removeTranslationBubble() {
  if (translationBubble) {
    console.log('🗑️ Removing translation bubble');
    translationBubble.remove();
    translationBubble = null;
    console.log('✅ Translation bubble removed');
  }
}

// Show translation popup
async function showTranslationPopup() {
  console.log('🔄 showTranslationPopup called, text:', currentSelectedText);
  
  // Force remove bubble immediately
  removeTranslationBubble();
  
  if (!currentSelectedText) {
    console.log('❌ No text selected');
    return;
  }
  
  // Get target language from extension storage
  const result = await chrome.storage.local.get('app_language');
  const targetLanguage = result.app_language || 'en';
  
  console.log('🌍 Target language:', targetLanguage);
  
  // Language names mapping
  const languageNames: Record<string, string> = {
    en: 'English', de: 'German', es: 'Spanish', fr: 'French',
    ja: 'Japanese', pt: 'Portuguese', ar: 'Arabic', cs: 'Czech',
    it: 'Italian', ko: 'Korean', nl: 'Dutch', zh: 'Chinese', ru: 'Russian'
  };
  
  const targetLanguageName = languageNames[targetLanguage] || 'English';
  
  // Create popup overlay
  const overlay = document.createElement('div');
  overlay.className = 'sigma-translate-popup-overlay';
  
  // Create popup
  const popup = document.createElement('div');
  popup.className = 'sigma-translate-popup';
  
  popup.innerHTML = `
    <div class="sigma-translate-popup-header">
      <div class="sigma-translate-popup-title">Translation</div>
      <button class="sigma-translate-popup-close">×</button>
    </div>
    
    <div class="sigma-translate-section">
      <div class="sigma-translate-section-title">Original Text</div>
      <div class="sigma-translate-text-box">${escapeHtml(currentSelectedText)}</div>
    </div>
    
    <div class="sigma-translate-section">
      <div class="sigma-translate-section-title">Translation (${targetLanguageName})</div>
      <div class="sigma-translate-text-box" id="sigma-translation-result">
        <div class="sigma-translate-loading">
          <div style="text-align: center;">
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
  
  // Close button handler
  const closeBtn = popup.querySelector('.sigma-translate-popup-close');
  closeBtn?.addEventListener('click', removeTranslationPopup);
  
  // Close on overlay click
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) {
      removeTranslationPopup();
    }
  });
  
  // Start translation
  try {
    console.log('📤 Sending translation request...');
    const translationResult = await translateTextViaBackground(currentSelectedText, targetLanguageName);
    console.log('✅ Translation received:', translationResult);
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
        resultBox.innerHTML = `<div class="sigma-translate-error">⚠️ Extension was updated. Please <strong>reload the page</strong> (F5) to use translation.</div>`;
      } else if (errorMessage.includes('LlamaCpp')) {
        resultBox.innerHTML = `<div class="sigma-translate-error">❌ Translation failed. Please make sure LlamaCpp is running on port 10345.</div>`;
      } else {
        resultBox.innerHTML = `<div class="sigma-translate-error">❌ ${escapeHtml(errorMessage)}</div>`;
      }
    }
  }
}

// Remove translation popup
function removeTranslationPopup() {
  if (translationPopup) {
    translationPopup.remove();
    translationPopup = null;
  }
}

// Translate text via background script with streaming
async function translateTextViaBackground(text: string, targetLanguage: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
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

// Escape HTML
function escapeHtml(text: string): string {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// Initialize translation feature
console.log('🔧 Initializing translation feature...');
injectTranslationStyles();
console.log('✅ Translation styles injected');

let mouseUpTimeout: number | null = null;

document.addEventListener('mouseup', (e: MouseEvent) => {
  console.log('🖱️ mouseup event detected');
  
  // Clear previous timeout
  if (mouseUpTimeout) {
    clearTimeout(mouseUpTimeout);
  }
  
  // Longer delay to ensure selection is complete
  mouseUpTimeout = window.setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    console.log('📝 Selection after delay:', selectedText);
    
    if (selectedText && selectedText.length > 0) {
      showTranslationBubble(e.clientX, e.clientY);
    } else {
      console.log('⚠️ Still no selection after delay');
      removeTranslationBubble();
    }
  }, 150); // Increased delay to 150ms
});

console.log('✅ Translation mouseup listener added');

// Remove bubble on mousedown (starting new selection)
document.addEventListener('mousedown', (e) => {
  // Don't remove bubble if clicking on the bubble itself
  if (translationBubble && translationBubble.contains(e.target as Node)) {
    console.log('👆 Clicked on translation bubble - keeping it');
    return;
  }
  
  if (mouseUpTimeout) {
    clearTimeout(mouseUpTimeout);
  }
  removeTranslationBubble();
});

// Observe DOM changes to update context if needed
const observer = new MutationObserver((mutations) => {
  // This could be used to detect significant page changes
  // and update cached context
});

// Start observing if needed
// observer.observe(document.body, { childList: true, subtree: true });


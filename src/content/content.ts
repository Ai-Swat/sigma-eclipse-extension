// Content script for Sigma Private - runs on all web pages

import { getPageContext } from './page-context';
import { injectTranslationStyles } from './translation/styles';
import { initTranslationEventHandlers } from './translation/event-handlers';
import { updateTranslationResult } from './translation/popup';

// Prevent multiple injections
if ((window as any).__SIGMA_PRIVATE_CONTENT_SCRIPT_LOADED__) {
  console.log('⚠️ Sigma Private content script already loaded, skipping');
} else {
  (window as any).__SIGMA_PRIVATE_CONTENT_SCRIPT_LOADED__ = true;
  console.log('✅ Sigma Private content script loaded');
}

// ============================================================================
// MESSAGE HANDLERS
// ============================================================================

// Listen for messages from background script
if (typeof chrome !== 'undefined' && chrome.runtime) {
  chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
    console.log('📨 Content script received message:', message.type);

    if (message.type === 'GET_PAGE_CONTEXT') {
      try {
        const context = getPageContext();
        console.log('✅ Sending page context:', {
          url: context.url,
          title: context.title,
          contentLength: context.content.length,
          hasSelection: !!context.selectedText,
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
      updateTranslationResult(message.fullText);
      return true;
    }
  });
} else {
  console.error('Chrome extension API not available');
}

// ============================================================================
// INITIALIZATION
// ============================================================================

// Initialize translation feature
console.log('🔧 Initializing translation feature...');
injectTranslationStyles();
console.log('✅ Translation styles injected');

initTranslationEventHandlers();

// Observe DOM changes to update context if needed
// const observer = new MutationObserver((_mutations) => {
//   // This could be used to detect significant page changes
//   // and update cached context
// });

// Start observing if needed
// observer.observe(document.body, { childList: true, subtree: true });

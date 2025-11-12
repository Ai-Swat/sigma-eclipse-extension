// Background service worker for Sigma Private extension

import { MessageType } from './types';
import { handleChatRequest } from './handlers/chat-handler';
import { handleGetPageContext } from './handlers/context-handler';
import { handleTranslation } from './handlers/translation-handler';
import { handleInstallation, handleContextMenuClick } from './handlers/menu-handler';

console.log('Sigma Private background service worker initialized');

// Handle action button click - open side panel
chrome.action.onClicked.addListener(tab => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id }).catch(error => {
      console.error('Error opening side panel:', error);
    });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message.type);

  switch (message.type) {
    case MessageType.CHAT_REQUEST:
      handleChatRequest(message.payload, sender)
        .then(sendResponse)
        .catch(error => {
          console.error('Chat request error:', error);
          sendResponse({ error: error.message });
        });
      return true; // Keep channel open for async response

    case MessageType.GET_PAGE_CONTEXT:
      handleGetPageContext(sender)
        .then(sendResponse)
        .catch(error => {
          console.error('Get context error:', error);
          sendResponse({ error: error.message });
        });
      return true;

    case MessageType.TRANSLATE_TEXT:
      handleTranslation(message, sender.tab?.id)
        .then(sendResponse)
        .catch(error => {
          console.error('Translation error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case MessageType.SUMMARIZE_PAGE:
      // This message is handled by the sidepanel directly
      // Background script just passes it through
      sendResponse({ success: true });
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
      return false;
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(handleInstallation);

// Handle context menu click
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

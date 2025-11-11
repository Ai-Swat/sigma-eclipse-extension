// Local types (inlined to avoid bundler creating shared chunks)
interface PageContext {
  url: string;
  title: string;
  content: string;
  selectedText?: string;
}

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
}

interface ChatRequest {
  message: string;
  includeContext?: boolean;
  history?: ChatMessage[];
}

interface ChatResponse {
  message: string;
  error?: string;
}

const MessageType = {
  GET_PAGE_CONTEXT: 'GET_PAGE_CONTEXT',
  TRANSLATE_TEXT: 'TRANSLATE_TEXT',
  CHAT_REQUEST: 'CHAT_REQUEST',
  CHAT_RESPONSE: 'CHAT_RESPONSE',
  SUMMARIZE_PAGE: 'SUMMARIZE_PAGE',
  ERROR: 'ERROR',
} as const;

// Background service worker for Sigma Private extension
console.log('Sigma Private background service worker initialized');

// Handle action button click - open side panel
chrome.action.onClicked.addListener((tab) => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id }).catch((error) => {
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
      handleTranslation(message.payload)
        .then(sendResponse)
        .catch(error => {
          console.error('Translation error:', error);
          sendResponse({ error: error.message });
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

async function handleChatRequest(
  request: ChatRequest,
  sender: chrome.runtime.MessageSender
): Promise<ChatResponse> {
  try {
    let contextInfo = '';

    // Get page context if requested
    if (request.includeContext) {
      const context = await getActiveTabContext();
      if (context) {
        contextInfo = `\n\nPage Context:\nURL: ${context.url}\nTitle: ${context.title}\nContent Preview: ${context.content.substring(0, 500)}...`;
      }
    }

    // TODO: Integrate with actual AI API (OpenAI, Anthropic, etc.)
    // For now, return a placeholder response
    const response: ChatResponse = {
      message: `[AI Response Placeholder]\n\nYou said: "${request.message}"${contextInfo}\n\nNote: Please configure your AI API key in the extension settings to enable actual AI responses.`
    };

    return response;
  } catch (error) {
    throw new Error('Failed to process chat request: ' + (error as Error).message);
  }
}

async function handleGetPageContext(
  sender: chrome.runtime.MessageSender
): Promise<PageContext | null> {
  return await getActiveTabContext();
}

async function getActiveTabContext(): Promise<PageContext | null> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return null;

    // Send message to content script to get page content
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: MessageType.GET_PAGE_CONTEXT
    });

    return response;
  } catch (error) {
    console.error('Error getting page context:', error);
    return null;
  }
}

async function handleTranslation(payload: any): Promise<any> {
  // TODO: Implement translation functionality
  // This could use browser's built-in translation API or external service
  return {
    translatedText: `[Translation of: "${payload.text}"]`,
    sourceLang: payload.sourceLang || 'auto',
    targetLang: payload.targetLang
  };
}

// Handle extension installation
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    console.log('Sigma Private extension installed');
    // Open options page or welcome page
    chrome.storage.local.set({
      settings: {
        apiKey: '',
        model: 'gpt-4',
        language: 'en'
      }
    });
  } else if (details.reason === 'update') {
    console.log('Sigma Private extension updated');
  }
  
  // Add context menu items
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open Sigma Private Sidebar',
    contexts: ['all']
  });
  
  chrome.contextMenus.create({
    id: 'summarizePage',
    title: 'Summarize page',
    contexts: ['page', 'selection']
  });
});

// Handle context menu click
chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'openSidePanel' && tab?.id) {
    chrome.sidePanel.open({ tabId: tab.id }).catch((error) => {
      console.error('Error opening side panel from context menu:', error);
    });
  } else if (info.menuItemId === 'summarizePage' && tab?.id) {
    // Open side panel first
    chrome.sidePanel.open({ tabId: tab.id }).then(() => {
      // Wait for sidepanel to initialize before sending message
      setTimeout(() => {
        chrome.runtime.sendMessage({
          type: MessageType.SUMMARIZE_PAGE,
          payload: { tabId: tab.id }
        }).catch((error) => {
          console.error('Error sending summarize message:', error);
        });
      }, 500); // Give sidepanel time to mount and register listeners
    }).catch((error) => {
      console.error('Error opening side panel for summarization:', error);
    });
  }
});


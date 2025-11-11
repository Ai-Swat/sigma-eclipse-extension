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

async function handleChatRequest(
  request: ChatRequest,
  _sender: chrome.runtime.MessageSender
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
  _sender: chrome.runtime.MessageSender
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

async function handleTranslation(payload: any, tabId?: number): Promise<any> {
  try {
    const { text, targetLanguage } = payload;
    
    if (!text || !targetLanguage) {
      throw new Error('Missing text or target language');
    }
    
    // Call LlamaCpp API for translation with streaming
    const LLAMACPP_URL = 'http://localhost:10345';
    
    const response = await fetch(`${LLAMACPP_URL}/v1/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'local-model',
        messages: [
          {
            role: 'system',
            content: `You are a professional translator. Translate the following text to ${targetLanguage}. Provide ONLY the translation without any additional comments, explanations, or formatting. Keep the same tone and style as the original.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.3,
        max_tokens: 2048,
        stream: true
      })
    });
    
    if (!response.ok) {
      throw new Error(`LlamaCpp API error: ${response.status}`);
    }
    
    // Handle streaming response
    const reader = response.body?.getReader();
    const decoder = new TextDecoder();
    let fullTranslation = '';
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') continue;
            
            try {
              const parsed = JSON.parse(data);
              const content = parsed.choices?.[0]?.delta?.content || '';
              if (content) {
                fullTranslation += content;
                
                // Send chunk to content script
                if (tabId) {
                  chrome.tabs.sendMessage(tabId, {
                    type: 'TRANSLATION_CHUNK',
                    chunk: content,
                    fullText: fullTranslation
                  }).catch(() => {
                    // Ignore errors if content script not ready
                  });
                }
              }
            } catch (e) {
              // Skip invalid JSON
            }
          }
        }
      }
    }
    
    return {
      success: true,
      translation: fullTranslation.trim()
    };
  } catch (error) {
    console.error('Translation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Translation failed'
    };
  }
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


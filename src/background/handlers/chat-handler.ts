// Handler for chat operations

import { ChatRequest, ChatResponse } from '../types';
import { getActiveTabContext } from './context-handler';

export async function handleChatRequest(
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


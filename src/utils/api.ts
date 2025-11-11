import OpenAI from 'openai';
import type { ChatMessage } from '../types';

const LLAMACPP_URL = 'http://localhost:10345';

// Initialize OpenAI client configured for LlamaCpp
const client = new OpenAI({
  baseURL: `${LLAMACPP_URL}/v1`,
  apiKey: 'not-needed', // LlamaCpp doesn't require API key
  dangerouslyAllowBrowser: true, // Allow usage in browser extension
});

/**
 * Send chat completion request to LlamaCpp with streaming support via OpenAI library
 */
export async function sendChatMessage(
  messages: ChatMessage[],
  options?: {
    temperature?: number;
    max_tokens?: number;
    onChunk?: (chunk: string) => void;
  }
): Promise<string> {
  try {
    // Add system prompt to enforce markdown formatting
    const systemPrompt = {
      role: 'system' as const,
      content: 'You are a helpful AI assistant. Always format your responses using Markdown syntax. Use headings, lists, code blocks, bold, italic, and other markdown features to make your responses clear and well-structured.'
    };
    
    // Convert our ChatMessage format to OpenAI format
    const openaiMessages = [
      systemPrompt,
      ...messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }))
    ];

    // Handle streaming
    if (options?.onChunk) {
      const stream = await client.chat.completions.create({
        model: 'local-model', // LlamaCpp ignores this
        messages: openaiMessages,
        temperature: options.temperature ?? 0.7,
        max_tokens: options.max_tokens ?? 2048,
        stream: true,
      });

      let fullContent = '';

      for await (const chunk of stream) {
        const content = chunk.choices[0]?.delta?.content || '';
        if (content) {
          fullContent += content;
          options.onChunk(content);
        }
      }

      return fullContent;
    }

    // Handle non-streaming
    const response = await client.chat.completions.create({
      model: 'local-model',
      messages: openaiMessages,
      temperature: options?.temperature ?? 0.7,
      max_tokens: options?.max_tokens ?? 2048,
      stream: false,
    });

    return response.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Error calling LlamaCpp:', error);
    throw new Error('Failed to connect to LlamaCpp. Make sure it is running on port 10345.');
  }
}


/**
 * Generate a title for a chat based on the first message
 */
export function generateChatTitle(firstMessage: string): string {
  const maxLength = 50;
  const cleaned = firstMessage.trim();
  
  if (cleaned.length <= maxLength) {
    return cleaned;
  }
  
  return cleaned.substring(0, maxLength) + '...';
}

/**
 * Check if LlamaCpp is available
 */
export async function checkLlamaCppConnection(): Promise<boolean> {
  try {
    // Try to get models list - standard OpenAI endpoint
    await client.models.list();
    return true;
  } catch (error) {
    console.warn('LlamaCpp not available:', error);
    return false;
  }
}


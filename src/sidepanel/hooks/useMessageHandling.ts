import { useState, useRef, useEffect, useCallback } from 'react';
import { Chat, ChatMessage } from '../../types';
import { sendChatMessage } from '../../utils/api';

interface UseMessageHandlingProps {
  activeChat: Chat | null;
  chats: Chat[];
  addMessageToChat: (chatId: string, message: ChatMessage) => void;
  updateMessageInChat: (chatId: string, messageId: string, content: string, isAborted?: boolean) => void;
  createNewChat: () => string;
}

interface MessageMetadata {
  isSummarization?: boolean;
  summarizationPreview?: string;
}

export const useMessageHandling = ({
  activeChat,
  chats,
  addMessageToChat,
  updateMessageInChat,
  createNewChat,
}: UseMessageHandlingProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Use ref to always have the latest activeChat value
  const activeChatRef = useRef(activeChat);
  const abortControllerRef = useRef<AbortController | null>(null);
  const currentMessageIdRef = useRef<string | null>(null);
  const currentChatIdRef = useRef<string | null>(null);
  
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const handleStopGeneration = useCallback(() => {
    console.log('🛑 Остановка генерации...');
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    
    // Mark current message as aborted
    if (currentChatIdRef.current && currentMessageIdRef.current) {
      const currentChat = chats.find(c => c.id === currentChatIdRef.current);
      const currentMessage = currentChat?.messages.find(m => m.id === currentMessageIdRef.current);
      
      if (currentMessage) {
        const abortedContent = currentMessage.content 
          ? `${currentMessage.content}\n\n_[Generation aborted]_` 
          : '_[Generation aborted]_';
        
        updateMessageInChat(
          currentChatIdRef.current,
          currentMessageIdRef.current,
          abortedContent,
          true // isAborted
        );
      }
    }
    
    setIsGenerating(false);
    setIsLoading(false);
    currentMessageIdRef.current = null;
    currentChatIdRef.current = null;
  }, [chats, updateMessageInChat]);

  const handleSendMessage = useCallback(async (
    content: string, 
    targetChatId?: string,
    metadata?: MessageMetadata
  ) => {
    if (!content.trim()) return;
    
    // Determine which chat to use
    let chatId: string;
    let currentChat: Chat | null;
    
    if (targetChatId) {
      // Use specified chat ID (for new chats created for summarization)
      chatId = targetChatId;
      currentChat = chats.find(c => c.id === chatId) || null;
      console.log('✅ Отправка сообщения в указанный чат:', chatId);
    } else {
      // Use active chat
      currentChat = activeChatRef.current;
      if (!currentChat) {
        console.log('⚠️ Нет активного чата, создаю новый...');
        createNewChat();
        return; // Exit and let user send again
      }
      chatId = currentChat.id;
      console.log('✅ Отправка сообщения в активный чат:', chatId);
    }

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now(),
      ...(metadata || {})
    };

    addMessageToChat(chatId, userMessage);

    // Create empty assistant message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    addMessageToChat(chatId, assistantMessage);
    setIsLoading(true); // Disable input during generation
    setIsGenerating(true); // Show stop button
    
    // Create abort controller
    const abortController = new AbortController();
    abortControllerRef.current = abortController;
    currentMessageIdRef.current = assistantMessageId;
    currentChatIdRef.current = chatId;

    try {
      // Send to LlamaCpp with streaming
      const allMessages = currentChat ? [...currentChat.messages, userMessage] : [userMessage];
      let accumulatedContent = '';
      
      console.log('🚀 Отправляю запрос к LlamaCpp...');
      
      await sendChatMessage(allMessages, {
        onChunk: (chunk: string) => {
          // Accumulate content and update message
          accumulatedContent += chunk;
          updateMessageInChat(chatId, assistantMessageId, accumulatedContent);
        },
        abortSignal: abortController.signal,
      });

      console.log('✅ Ответ получен');

    } catch (error: any) {
      console.error('❌ Ошибка при отправке сообщения:', error);
      
      // Check if error is due to abort
      if (error?.name === 'AbortError' || abortController.signal.aborted) {
        console.log('⚠️ Генерация была прервана пользователем');
        // Message already marked as aborted in handleStopGeneration
      } else {
        updateMessageInChat(
          chatId,
          assistantMessageId, 
          'Error: Failed to connect to LlamaCpp. Make sure it is running on port 10345.'
        );
      }
    } finally {
      setIsLoading(false);
      setIsGenerating(false);
      abortControllerRef.current = null;
      currentMessageIdRef.current = null;
      currentChatIdRef.current = null;
    }
  }, [chats, activeChatRef, addMessageToChat, updateMessageInChat, createNewChat]);

  return {
    isLoading,
    isGenerating,
    handleSendMessage,
    handleStopGeneration,
  };
};


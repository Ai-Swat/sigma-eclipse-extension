import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Chat, ChatMessage, MessageType } from '../types';
import { ChatContextProvider, useChatContext } from '../contexts/chatContext';
import { sendChatMessage } from '../utils/api';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import MessageInputWrapper from './components/MessageInputWrapper';
import ChatHistory from './components/ChatHistory';

const AppContent: React.FC = () => {
  const { 
    chats,
    activeChat, 
    createNewChat,
    selectChat,
    deleteChat,
    addMessageToChat,
    updateMessageInChat
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  
  // Use ref to always have the latest activeChat value
  const activeChatRef = useRef(activeChat);
  useEffect(() => {
    activeChatRef.current = activeChat;
  }, [activeChat]);

  const handleSendMessage = async (content: string, targetChatId?: string) => {
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
      timestamp: Date.now()
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
        }
      });

      console.log('✅ Ответ получен');

    } catch (error) {
      console.error('❌ Ошибка при отправке сообщения:', error);
      updateMessageInChat(
        chatId,
        assistantMessageId, 
        'Error: Failed to connect to LlamaCpp. Make sure it is running on port 10345.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewThread = () => {
    // Don't create new chat if current chat is empty
    if (activeChat && activeChat.messages.length === 0) {
      return;
    }
    createNewChat();
  };

  const handleHistory = () => {
    setIsHistoryOpen(true);
  };

  const handleSummarize = useCallback(async () => {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id || !tab.url) {
        console.error('No active tab found');
        alert('Не удалось получить активную вкладку');
        return;
      }

      // Check if page is accessible (not chrome:// or chrome-extension://)
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        console.error('Cannot access chrome:// pages');
        alert('Суммаризация не работает на служебных страницах Chrome.\nОткройте обычную веб-страницу.');
        return;
      }

      console.log('🔍 Получаю контекст страницы:', tab.url);

      let response;
      let needsInjection = false;
      
      try {
        // Try to get page context from content script
        response = await chrome.tabs.sendMessage(tab.id, {
          type: MessageType.GET_PAGE_CONTEXT
        });
        console.log('✅ Content script ответил');
      } catch (error: any) {
        console.warn('⚠️ Content script не отвечает:', error.message);
        needsInjection = true;
      }

      // If content script didn't respond, try to inject it
      if (needsInjection) {
        console.log('💉 Инжектирую content script...');
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
          
          console.log('✅ Content script инжектирован, жду инициализации...');
          // Wait a bit for script to initialize
          await new Promise(resolve => setTimeout(resolve, 300));
          
          // Try again
          response = await chrome.tabs.sendMessage(tab.id, {
            type: MessageType.GET_PAGE_CONTEXT
          });
          console.log('✅ Content script ответил после инжекции');
        } catch (injectError: any) {
          console.error('❌ Не удалось инжектировать content script:', injectError.message);
          alert('Не удалось получить контент страницы.\n\nПопробуйте:\n1. Перезагрузить страницу (F5)\n2. Попробовать снова');
          return;
        }
      }

      if (!response) {
        console.error('Failed to get page context');
        alert('Не удалось получить контент страницы');
        return;
      }

      // Use selected text if available, otherwise use page content
      const textToSummarize = response.selectedText || response.content;
      
      if (!textToSummarize || textToSummarize.trim().length === 0) {
        console.error('No content to summarize');
        alert('На странице нет текста для суммаризации');
        return;
      }

      console.log('📝 Текст для суммаризации получен:', textToSummarize.substring(0, 100) + '...');

      // Create new chat and get its ID
      console.log('🆕 Создаю новый чат для суммаризации...');
      const newChatId = createNewChat();
      console.log('✅ Новый чат создан с ID:', newChatId);

      // Send summarization prompt to the new chat
      const prompt = `Сделай краткую выжимку основных мыслей из текста: ${textToSummarize}`;
      await handleSendMessage(prompt, newChatId);

    } catch (error) {
      console.error('❌ Ошибка при суммаризации:', error);
      alert('Произошла ошибка при суммаризации. Проверьте консоль для деталей.');
    }
  }, [createNewChat]);

  // Listen for summarization requests from context menu
  useEffect(() => {
    const messageListener = (message: any) => {
      console.log('📨 Sidepanel получил сообщение:', message.type);
      if (message.type === MessageType.SUMMARIZE_PAGE) {
        console.log('🎯 Запускаю суммаризацию из контекстного меню');
        handleSummarize();
      }
    };

    console.log('✅ Sidepanel зарегистрировал listener для SUMMARIZE_PAGE');
    chrome.runtime.onMessage.addListener(messageListener);
    
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [handleSummarize]);

  return (
    <>
      <div className="app-container">
        <Header
          onNewThread={handleNewThread}
          onHistory={handleHistory}
          onSummarize={handleSummarize}
        />
        
        <ChatContainer 
          messages={activeChat?.messages || []} 
          isLoading={isLoading} 
        />
        
        <MessageInputWrapper 
          onSendMessage={handleSendMessage}
          disabled={isLoading}
        />
      </div>

      {isHistoryOpen && (
        <ChatHistory
          chats={chats}
          activeChatId={activeChat?.id || null}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onNewChat={createNewChat}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}
    </>
  );
};

const App: React.FC = () => {
  return (
    <ChatContextProvider>
      <AppContent />
    </ChatContextProvider>
  );
};

export default App;


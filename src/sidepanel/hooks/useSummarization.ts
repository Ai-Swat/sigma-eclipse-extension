import { useCallback, useEffect } from 'react';
import { MessageType } from '../../types';
import { useLanguage } from '../contexts/languageContext';

interface UseSummarizationProps {
  createNewChat: () => string;
  handleSendMessage: (
    content: string, 
    targetChatId?: string,
    metadata?: { isSummarization?: boolean; summarizationPreview?: string }
  ) => Promise<void>;
}

export const useSummarization = ({
  createNewChat,
  handleSendMessage,
}: UseSummarizationProps) => {
  const { getSummarizationPrompt } = useLanguage();
  
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

      // Use selected text if it's long enough (>= 200 chars), otherwise use page content
      const MIN_SELECTION_LENGTH = 200;
      const hasValidSelection = response.selectedText && response.selectedText.trim().length >= MIN_SELECTION_LENGTH;
      const textToSummarize = hasValidSelection ? response.selectedText : response.content;
      
      if (!textToSummarize || textToSummarize.trim().length === 0) {
        console.error('No content to summarize');
        alert('На странице нет текста для суммаризации');
        return;
      }

      console.log('📝 Текст для суммаризации получен:', textToSummarize.substring(0, 100) + '...');

      // Create preview for the banner
      let preview = '';
      if (hasValidSelection) {
        // Show first 50 chars of selected text
        preview = response.selectedText!.substring(0, 50).trim() + (response.selectedText!.length > 50 ? '...' : '');
      } else {
        // Show URL if no valid selection or using page content
        preview = tab.url || 'Page content';
      }

      // Create new chat and get its ID
      console.log('🆕 Создаю новый чат для суммаризации...');
      const newChatId = createNewChat();
      console.log('✅ Новый чат создан с ID:', newChatId);

      // Send summarization prompt to the new chat with metadata
      const prompt = `${getSummarizationPrompt()} ${textToSummarize}`;
      await handleSendMessage(prompt, newChatId, {
        isSummarization: true,
        summarizationPreview: preview
      });

    } catch (error) {
      console.error('❌ Ошибка при суммаризации:', error);
      alert('Произошла ошибка при суммаризации. Проверьте консоль для деталей.');
    }
  }, [createNewChat, handleSendMessage, getSummarizationPrompt]);

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

  return {
    handleSummarize,
  };
};


import { useCallback, useEffect } from 'react';
import { MessageType } from '@/types';
import { useLanguage } from '@/sidepanel/contexts/languageContext.tsx';
import { addToastError } from '@/libs/toast-messages.ts';

interface UseSummarizationProps {
  createNewChat: () => string;
  handleSendMessage: (
    content: string,
    targetChatId?: string,
    metadata?: { isSummarization?: boolean; summarizationPreview?: string; favicon?: string }
  ) => Promise<void>;
}

export const useSummarization = ({ createNewChat, handleSendMessage }: UseSummarizationProps) => {
  const { getSummarizationPrompt } = useLanguage();

  const handleSummarize = useCallback(async () => {
    try {
      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id || !tab.url) {
        console.error('No active tab found.');
        addToastError('Failed to get the active tab.');
        return;
      }

      // Check if page is accessible (not chrome:// or chrome-extension://)
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        console.error('Cannot access chrome:// pages');
        addToastError(
          'Summarization is not available on Chrome system pages. Please open a regular web page.'
        );
        return;
      }

      console.log('🔍 Getting page context from:', tab.url);

      let response;
      let needsInjection = false;

      try {
        // Try to get page context from content script
        response = await chrome.tabs.sendMessage(tab.id, {
          type: MessageType.GET_PAGE_CONTEXT,
        });
        console.log('✅ Content script responded.');
      } catch (error: any) {
        console.warn('⚠️ Content script did not respond:', error.message);
        needsInjection = true;
      }

      // If content script didn't respond, try to inject it
      if (needsInjection) {
        console.log('💉 Injecting content script...');
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
          });

          console.log('✅ Content script injected, waiting for initialization...');
          // Wait a bit for script to initialize
          await new Promise(resolve => setTimeout(resolve, 300));

          // Try again
          response = await chrome.tabs.sendMessage(tab.id, {
            type: MessageType.GET_PAGE_CONTEXT,
          });
          console.log('✅ Content script responded after injection.');
        } catch (injectError: any) {
          console.error('❌ Failed to inject content script:', injectError.message);
          addToastError('Failed to retrieve page content. Try reload the page (F5).');
          return;
        }
      }

      if (!response) {
        console.error('Failed to retrieve page context.');
        addToastError('Could not get the page content.');
        return;
      }

      // Always use full page content for summarization
      const textToSummarize = response.content;

      if (!textToSummarize || textToSummarize.trim().length === 0) {
        console.error('No content found to summarize.');
        addToastError('There is no readable text on this page to summarize.');
        return;
      }

      console.log(
        '📝 Page text retrieved for summarization:',
        textToSummarize.substring(0, 100) + '...'
      );

      // Create preview for the banner - always show URL for full page summarization
      const preview = tab.title || 'Page content';
      const favicon = tab.favIconUrl;

      // Create a new chat and get its ID
      console.log('🆕 Creating new chat for summarization...');
      const newChatId = createNewChat();
      console.log('✅ New chat created with ID:', newChatId);

      // Send summarization prompt to the new chat with metadata
      const prompt = `${getSummarizationPrompt()} ${textToSummarize}`;
      await handleSendMessage(prompt, newChatId, {
        isSummarization: true,
        summarizationPreview: preview,
        favicon,
      });
    } catch (error) {
      console.error('❌ Error during summarization:', error);
      addToastError('An error occurred while summarizing. Please check the console for details.');
    }
  }, [createNewChat, handleSendMessage, getSummarizationPrompt]);

  // Listen for summarization requests from context menu
  useEffect(() => {
    const messageListener = (message: any) => {
      console.log('📨 Sidepanel received message:', message.type);
      if (message.type === MessageType.SUMMARIZE_PAGE) {
        console.log('🎯 Triggering summarization from context menu.');
        handleSummarize();
      }
    };

    console.log('✅ Sidepanel registered listener for SUMMARIZE_PAGE.');
    chrome.runtime.onMessage.addListener(messageListener);

    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, [handleSummarize]);

  return {
    handleSummarize,
  };
};

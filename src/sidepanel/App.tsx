import React, { useState, useEffect, useRef } from 'react';
import { MessageType, ChatMessage, ChatRequest } from '../types';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import MessageInput from './components/MessageInput';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [contextEnabled, setContextEnabled] = useState(false);
  const [translationMode, setTranslationMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    loadChatHistory();
  }, []);

  // Save chat history when messages change
  useEffect(() => {
    if (messages.length > 0) {
      saveChatHistory();
    }
  }, [messages]);

  const loadChatHistory = async () => {
    const data = await chrome.storage.local.get('chatHistory');
    if (data.chatHistory && Array.isArray(data.chatHistory)) {
      setMessages(data.chatHistory);
    } else {
      // Add welcome message
      const welcomeMessage: ChatMessage = {
        id: Date.now().toString(),
        role: 'assistant',
        content: 'Hello! I\'m Sigma Private, your AI assistant. How can I help you today?',
        timestamp: Date.now()
      };
      setMessages([welcomeMessage]);
    }
  };

  const saveChatHistory = () => {
    chrome.storage.local.set({
      chatHistory: messages.slice(-50) // Keep last 50 messages
    });
  };

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      // Send to background script
      const request: ChatRequest = {
        message: content,
        includeContext: contextEnabled,
        history: messages.slice(-10) // Last 10 messages for context
      };

      const response = await chrome.runtime.sendMessage({
        type: MessageType.CHAT_REQUEST,
        payload: request
      });

      // Add assistant response
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response.message || 'Sorry, I encountered an error.',
        timestamp: Date.now()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Error: Failed to connect to the AI service. Please check your settings.',
        timestamp: Date.now()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleContext = () => {
    setContextEnabled(prev => !prev);
  };

  const handleToggleTranslation = () => {
    setTranslationMode(prev => !prev);
  };

  const handleSettings = () => {
    // TODO: Open settings page
    console.log('Settings clicked');
  };

  return (
    <div className="container">
      <Header
        onToggleContext={handleToggleContext}
        onToggleTranslation={handleToggleTranslation}
        onSettings={handleSettings}
        contextEnabled={contextEnabled}
        translationMode={translationMode}
      />
      
      <ChatContainer messages={messages} isLoading={isLoading} />
      
      {contextEnabled && (
        <div className="context-indicator">
          <span>📄 Page context enabled</span>
        </div>
      )}
      
      <MessageInput 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
};

export default App;


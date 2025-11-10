import React, { useState, useEffect } from 'react';
import { MessageType, ChatMessage, ChatRequest } from '../types';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import MessageInputWrapper from './components/MessageInputWrapper';

const App: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
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
      setMessages([]);
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
        includeContext: false,
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

  const handleNewThread = () => {
    // Clear current chat and start new thread
    setMessages([]);
  };

  const handleHistory = () => {
    // TODO: Open history page/sidebar
    console.log('History clicked');
  };

  return (
    <div className="app-container">
      <Header
        onNewThread={handleNewThread}
        onHistory={handleHistory}
      />
      
      <ChatContainer messages={messages} isLoading={isLoading} />
      
      <MessageInputWrapper 
        onSendMessage={handleSendMessage}
        disabled={isLoading}
      />
    </div>
  );
};

export default App;


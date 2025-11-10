import React, { useState } from 'react';
import { ChatMessage } from '../types';
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
    addMessageToActiveChat, 
    updateMessageInActiveChat 
  } = useChatContext();
  const [isLoading, setIsLoading] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  const handleSendMessage = async (content: string) => {
    if (!content.trim() || !activeChat) return;

    // Add user message
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content,
      timestamp: Date.now()
    };

    addMessageToActiveChat(userMessage);

    // Create empty assistant message for streaming
    const assistantMessageId = (Date.now() + 1).toString();
    const assistantMessage: ChatMessage = {
      id: assistantMessageId,
      role: 'assistant',
      content: '',
      timestamp: Date.now()
    };

    addMessageToActiveChat(assistantMessage);
    setIsLoading(true); // Disable input during generation

    try {
      // Send to LlamaCpp with streaming
      const allMessages = [...activeChat.messages, userMessage];
      let accumulatedContent = '';
      
      await sendChatMessage(allMessages, {
        onChunk: (chunk: string) => {
          // Accumulate content and update message
          accumulatedContent += chunk;
          updateMessageInActiveChat(assistantMessageId, accumulatedContent);
        }
      });

    } catch (error) {
      console.error('Error sending message:', error);
      updateMessageInActiveChat(
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

  return (
    <>
      <div className="app-container">
        <Header
          onNewThread={handleNewThread}
          onHistory={handleHistory}
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


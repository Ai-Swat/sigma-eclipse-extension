import React, { useState } from 'react';
import { ChatContextProvider, useChatContext } from '../contexts/chatContext';
import { LanguageProvider } from './contexts/languageContext';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import MessageInputWrapper from './components/MessageInputWrapper';
import ChatHistory from './components/ChatHistory';
import { useMessageHandling } from './hooks/useMessageHandling';
import { useSummarization } from './hooks/useSummarization';
import { AppToaster } from '@/sidepanel/components/new-components/app/app-toaster';

const AppContent: React.FC = () => {
  const {
    chats,
    activeChat,
    createNewChat,
    selectChat,
    deleteChat,
    addMessageToChat,
    updateMessageInChat,
  } = useChatContext();

  const [isHistoryOpen, setIsHistoryOpen] = useState(false);

  // Message handling hook
  const { isLoading, isGenerating, handleSendMessage, handleStopGeneration } = useMessageHandling({
    activeChat,
    chats,
    addMessageToChat,
    updateMessageInChat,
    createNewChat,
  });

  // Summarization hook
  const { handleSummarize } = useSummarization({
    createNewChat,
    handleSendMessage,
  });

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
          onSummarize={handleSummarize}
        />

        <ChatContainer messages={activeChat?.messages || []} isLoading={isLoading} />

        <MessageInputWrapper
          onSendMessage={handleSendMessage}
          disabled={isLoading}
          isGenerating={isGenerating}
          onStopGeneration={handleStopGeneration}
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

      <AppToaster />
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ChatContextProvider>
        <AppContent />
      </ChatContextProvider>
    </LanguageProvider>
  );
};

export default App;

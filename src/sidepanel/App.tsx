import React, { useEffect, useState } from 'react';
import { ChatContextProvider, useChatContext } from '@/sidepanel/contexts/chatContext';
import { LanguageProvider } from '@/sidepanel/contexts/languageContext.tsx';
import { ModelContextProvider } from '@/sidepanel/contexts/modelContext';
import { Header, ChatContainer, MessageInputWrapper } from './components';
import ChatHistory from './components/ChatHistory';
import InstallAppPrompt from './components/InstallAppPrompt';
import { useMessageHandling } from './hooks/useMessageHandling';
import { AppToaster } from 'src/components/app/app-toaster';

export const TEXTAREA_ID = 'TEXTAREA_ID';

const AppContent: React.FC = () => {
  const {
    chats,
    activeChat,
    createNewChat,
    selectChat,
    deleteChat,
    addMessageToChat,
    deleteAllChats,
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

  const handleNewThread = () => {
    const textarea = document.getElementById(TEXTAREA_ID);
    textarea?.focus();
    // Don't create new chat if current chat is empty
    if (activeChat && activeChat.messages.length === 0) {
      return;
    }

    const emptyChat = chats.find(chat => chat.messages.length === 0);
    if (emptyChat) {
      selectChat(emptyChat.id);
      return;
    }

    createNewChat();
  };

  const handleHistory = () => {
    setIsHistoryOpen(true);
  };

  useEffect(() => {
    const textarea = document.getElementById(TEXTAREA_ID);
    textarea?.focus();
  }, [activeChat?.id]);

  return (
    <>
      <div className="app-container">
        <Header onNewThread={handleNewThread} onHistory={handleHistory} />

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
          onDeleteAllChats={deleteAllChats}
          onSelectChat={selectChat}
          onDeleteChat={deleteChat}
          onNewChat={createNewChat}
          onClose={() => setIsHistoryOpen(false)}
        />
      )}

      <InstallAppPrompt />
      <AppToaster />
    </>
  );
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <ModelContextProvider>
        <ChatContextProvider>
          <AppContent />
        </ChatContextProvider>
      </ModelContextProvider>
    </LanguageProvider>
  );
};

export default App;

import React, { createContext, useContext, useState, useCallback, PropsWithChildren, useEffect } from 'react';
import { Chat, ChatMessage } from '../types';
import { generateChatTitle } from '../utils/api';

interface ChatContextType {
  chats: Chat[];
  activeChat: Chat | null;
  createNewChat: () => string; // Returns the new chat ID
  selectChat: (chatId: string) => void;
  deleteChat: (chatId: string) => void;
  addMessageToActiveChat: (message: ChatMessage) => void;
  addMessageToChat: (chatId: string, message: ChatMessage) => void; // Add message to specific chat
  updateMessageInActiveChat: (messageId: string, content: string) => void;
  updateMessageInChat: (chatId: string, messageId: string, content: string) => void; // Update message in specific chat
  updateChatTitle: (chatId: string, title: string) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatContextProvider({ children }: PropsWithChildren) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Load chats from storage on mount
  useEffect(() => {
    loadChatsFromStorage();
  }, []);

  // Save chats to storage when they change
  useEffect(() => {
    if (chats.length > 0) {
      saveChatsToStorage();
    }
  }, [chats]);

  const loadChatsFromStorage = async () => {
    try {
      const data = await chrome.storage.local.get('chats');
      if (data.chats && Array.isArray(data.chats)) {
        setChats(data.chats);
        // Set first chat as active if exists
        if (data.chats.length > 0) {
          setActiveChatId(data.chats[0].id);
        }
      } else {
        // Create initial chat
        const initialChat = createChat();
        setChats([initialChat]);
        setActiveChatId(initialChat.id);
      }
    } catch (error) {
      console.error('Error loading chats:', error);
      // Create initial chat on error
      const initialChat = createChat();
      setChats([initialChat]);
      setActiveChatId(initialChat.id);
    }
  };

  const saveChatsToStorage = useCallback(() => {
    chrome.storage.local.set({ chats });
  }, [chats]);

  const createChat = (): Chat => {
    return {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
  };

  const createNewChat = useCallback(() => {
    const newChat = createChat();
    setChats((prev) => [newChat, ...prev]);
    setActiveChatId(newChat.id);
    return newChat.id; // Return the new chat ID
  }, []);

  const selectChat = useCallback((chatId: string) => {
    setActiveChatId(chatId);
  }, []);

  const deleteChat = useCallback((chatId: string) => {
    setChats((prev) => {
      const updated = prev.filter((chat) => chat.id !== chatId);
      
      // If deleting active chat, select another one
      if (activeChatId === chatId) {
        if (updated.length > 0) {
          setActiveChatId(updated[0].id);
        } else {
          // Create new chat if no chats left
          const newChat = createChat();
          setActiveChatId(newChat.id);
          return [newChat];
        }
      }
      
      return updated;
    });
  }, [activeChatId]);

  const addMessageToChat = useCallback((chatId: string, message: ChatMessage) => {
    setChats((prev) => {
      return prev.map((chat) => {
        if (chat.id === chatId) {
          const updatedMessages = [...chat.messages, message];
          
          // Auto-generate title from first user message
          let title = chat.title;
          if (title === 'New Chat' && message.role === 'user' && updatedMessages.length === 1) {
            title = generateChatTitle(message.content);
          }
          
          return {
            ...chat,
            messages: updatedMessages,
            title,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  }, []);

  const addMessageToActiveChat = useCallback((message: ChatMessage) => {
    if (!activeChatId) return;
    addMessageToChat(activeChatId, message);
  }, [activeChatId, addMessageToChat]);

  const updateMessageInChat = useCallback((chatId: string, messageId: string, content: string) => {
    setChats((prev) => {
      return prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            messages: chat.messages.map((msg) => 
              msg.id === messageId ? { ...msg, content } : msg
            ),
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  }, []);

  const updateMessageInActiveChat = useCallback((messageId: string, content: string) => {
    if (!activeChatId) return;
    updateMessageInChat(activeChatId, messageId, content);
  }, [activeChatId, updateMessageInChat]);

  const updateChatTitle = useCallback((chatId: string, title: string) => {
    setChats((prev) => {
      return prev.map((chat) => {
        if (chat.id === chatId) {
          return {
            ...chat,
            title,
            updatedAt: Date.now(),
          };
        }
        return chat;
      });
    });
  }, []);

  const activeChat = chats.find((chat) => chat.id === activeChatId) || null;

  const value: ChatContextType = {
    chats,
    activeChat,
    createNewChat,
    selectChat,
    deleteChat,
    addMessageToActiveChat,
    addMessageToChat,
    updateMessageInActiveChat,
    updateMessageInChat,
    updateChatTitle,
  };

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

export function useChatContext() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error('useChatContext must be used within ChatContextProvider');
  }
  return context;
}


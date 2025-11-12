import React from 'react';
import { Chat } from '@/types';
import styles from './ChatHistory.module.css';

interface ChatHistoryProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  onClose: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onDeleteChat,
  onNewChat,
  onClose,
}) => {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString();
  };

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    onClose();
  };

  const handleDeleteChat = (e: React.MouseEvent, chatId: string) => {
    e.stopPropagation();
    if (confirm('Delete this chat?')) {
      onDeleteChat(chatId);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>Chat History</h2>
          <button className={styles.closeButton} onClick={onClose}>
            ✕
          </button>
        </div>

        <button
          className={styles.newChatButton}
          onClick={() => {
            onNewChat();
            onClose();
          }}
        >
          + New Chat
        </button>

        <div className={styles.chatList}>
          {chats.length === 0 ? (
            <div className={styles.emptyState}>No chats yet. Start a new conversation!</div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`${styles.chatItem} ${chat.id === activeChatId ? styles.active : ''}`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className={styles.chatItemContent}>
                  <div className={styles.chatTitle}>{chat.title}</div>
                  <div className={styles.chatMeta}>
                    <span className={styles.chatDate}>{formatDate(chat.updatedAt)}</span>
                    <span className={styles.chatMessages}>{chat.messages.length} messages</span>
                  </div>
                </div>
                <button
                  className={styles.deleteButton}
                  onClick={e => handleDeleteChat(e, chat.id)}
                  title="Delete chat"
                >
                  🗑️
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;

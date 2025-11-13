import React, { useEffect, useRef, useState } from 'react';
import { Chat } from '@/types';
import styles from './ChatHistory.module.css';
import { BaseButton } from '@/sidepanel/components/ui';
import ClearIcon from '@/images/clear-icon.svg?react';
import DeleteIcon from '@/images/delete.svg?react';
import DotsIcon from '@/images/dots.svg?react';

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

  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const handleSelectChat = (chatId: string) => {
    onSelectChat(chatId);
    onClose();
  };

  const handleDeleteChat = (chatId: string) => {
    if (confirm('Delete this chat?')) {
      onDeleteChat(chatId);
    }
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.sidebar} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.title}>History</div>
          <div className={styles.headerButtonsWrapper} ref={menuRef}>
            <div className={styles.menuWrapper}>
            <BaseButton
              color="transparent"
              size="sm"
              onClick={() => setMenuOpen(prev => !prev)}
              isActive={menuOpen}
            >
              <DotsIcon />
            </BaseButton>

            {menuOpen && (
              <div className={styles.dropdownMenu}>
                <div
                  className={styles.dropdownItem}
                  onClick={() => {
                    setMenuOpen(false);
                  }}
                >
                  <DeleteIcon className={styles.dropdownIcon} />
                  Clear history
                </div>
              </div>
            )}
            </div>

            <BaseButton
              color={'transparent'}
              size={'sm'}
              onClick={onClose}
            >
              <ClearIcon />
            </BaseButton>
          </div>
        </div>

        <div className={styles.chatList}>
          {chats.length === 0 ? (
            <div className={styles.emptyState}>No chats yet. Start a new conversation!</div>
          ) : (
            chats.map(chat => (
              <div
                key={chat.id}
                className={`${styles.chatItem}`}
                onClick={() => handleSelectChat(chat.id)}
              >
                <div className={styles.chatItemContent}>
                  <div className={styles.chatTitle}>{chat.title}</div>
                  <span className={styles.chatDate}>{formatDate(chat.updatedAt)}</span>
                </div>

                  <BaseButton
                    color={'transparent'}
                    size={'xs'}
                    onClick={() => handleDeleteChat(chat.id)}
                  >
                    <DeleteIcon className={styles.deleteIcon} />
                  </BaseButton>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatHistory;

import React, { useRef, useState } from 'react';
import { Chat } from '@/types';
import styles from './ChatHistory.module.css';
import { BaseButton } from '@/sidepanel/components/ui';
import ClearIcon from '@/images/clear-icon.svg?react';
import { Popup } from '@/components/app/popup';
import DropdownMenu from '@/sidepanel/components/ui/DropdownMenu.tsx';

interface ChatHistoryProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (chatId: string) => void;
  onDeleteChat: (chatId: string) => void;
  onNewChat: () => void;
  onClose: () => void;
  onDeleteAllChats: () => void;
}

const ChatHistory: React.FC<ChatHistoryProps> = ({
  chats,
  onSelectChat,
  onDeleteChat,
  onDeleteAllChats,
  onClose,
}) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const historyChats = chats.filter(el => el.messages.length > 0);

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

  const handleDeleteChat = (chat: Chat) => {
    setActiveChat(chat);
    setShowPopup(true);
  };

  const deleteAllHistory = () => {
    if (historyChats.length === 0) return;
    setActiveChat(null);
    setShowPopup(true);
  };

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.sidebar} onClick={e => e.stopPropagation()}>
          <div className={styles.header}>
            <div className={styles.title}>History</div>
            <div className={styles.headerButtonsWrapper} ref={menuRef}>
              <DropdownMenu onDelete={deleteAllHistory} deleteTitle={'Clear history'} />

              <BaseButton color={'transparent'} size={'sm'} onClick={onClose}>
                <ClearIcon />
              </BaseButton>
            </div>
          </div>
          <div className={styles.chatList}>
            {historyChats.length === 0 ? (
              <div className={styles.emptyState}>
                No chats yet.
                <br />
                Start a new conversation!
              </div>
            ) : (
              historyChats.map(chat => (
                <div
                  key={chat.id}
                  className={`${styles.chatItem}`}
                  onClick={() => handleSelectChat(chat.id)}
                >
                  <div className={styles.chatItemContent}>
                    <div className={styles.chatTitle}>{chat.title}</div>
                    <span className={styles.chatDate}>{formatDate(chat.updatedAt)}</span>
                  </div>

                  <DropdownMenu
                    onDelete={() => handleDeleteChat(chat)}
                    deleteTitle={'Delete chat'}
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
      {showPopup && (
        <Popup
          itemName={activeChat ? activeChat.title : 'All history'}
          onCancel={() => setShowPopup(false)}
          onDelete={activeChat ? () => onDeleteChat(activeChat?.id) : onDeleteAllChats}
        ></Popup>
      )}
    </>
  );
};

export default ChatHistory;

import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import ChatMessage from './ChatMessage';
import styles from './ChatContainer.module.css';

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  // Empty state - show when no messages
  if (messages.length === 0 && !isLoading) {
    return (
      <div className="chat-messages-container customScrollBarVertical" ref={containerRef}>
        <div className={styles.emptyState}>
          <h1 className={styles.emptyStateTitle}>Make your private requests</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="chat-messages-container customScrollBarVertical" ref={containerRef}>
      <div className="chat-messages-list">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} isLoading={isLoading} />
        ))}
        {/* Don't show loader during streaming - empty assistant message is already visible */}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;

import React, { useEffect, useRef, useState } from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import ChatMessage from './ChatMessage';
import { SEARCH_SCROLL_CONTAINER } from '@/components/app/scroll-down-button';
import styles from './ChatContainer.module.css';

interface ChatContainerProps {
  messages: ChatMessageType[];
  isLoading: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Флаг: юзер внизу → автоскроллим; нет → не трогаем
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);

  // Проверяем, находится ли пользователь у низа
  const handleScroll = () => {
    if (!containerRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = containerRef.current;

    const isAtBottom = scrollTop + clientHeight >= scrollHeight - 10; // допуск 10px
    setShouldAutoScroll(isAtBottom);
  };

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    el.addEventListener('scroll', handleScroll);
    return () => el.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (shouldAutoScroll && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, isLoading, shouldAutoScroll]);

  // Empty state
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
    <div
      className="chat-messages-container customScrollBarVertical"
      id={SEARCH_SCROLL_CONTAINER}
      ref={containerRef}
    >
      <div className="chat-messages-list">
        {messages.map(message => (
          <ChatMessage key={message.id} message={message} isLoading={isLoading} />
        ))}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;

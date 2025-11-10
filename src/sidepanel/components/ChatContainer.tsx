import React, { useEffect, useRef } from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import ChatMessage from './ChatMessage';
import LoadingIndicator from './LoadingIndicator';

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

  return (
    <div className="chat-messages-container customScrollBarVertical" ref={containerRef}>
      <div className="chat-messages-list">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}
        {isLoading && <LoadingIndicator />}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatContainer;


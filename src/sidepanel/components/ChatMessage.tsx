import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  return (
    <div className={`message ${message.role}`}>
      <div className="message-content">
        {message.content}
      </div>
    </div>
  );
};

export default ChatMessage;


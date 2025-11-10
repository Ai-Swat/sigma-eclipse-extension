import React from 'react';
import { ChatMessage as ChatMessageType } from '../../types';
import { Loader } from 'src/components/ui/loader';

interface ChatMessageProps {
  message: ChatMessageType;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Show loader in empty assistant message (streaming starting)
  const isStreamingEmpty = message.role === 'assistant' && message.content === '';

  return (
    <div className={`chat-message ${message.role}`}>
      <div className="chat-message-content">
        {isStreamingEmpty ? (
          <div className="loading-indicator">
            <Loader size={24} color="primary" />
          </div>
        ) : (
          message.content
        )}
      </div>
    </div>
  );
};

export default ChatMessage;


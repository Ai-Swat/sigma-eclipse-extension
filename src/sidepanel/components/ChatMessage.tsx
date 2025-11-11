import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ChatMessage as ChatMessageType } from '../../types';
import { Loader } from 'src/components/ui/loader';

interface ChatMessageProps {
  message: ChatMessageType;
}

const SummarizationBanner: React.FC<{ preview: string }> = ({ preview }) => {
  return (
    <div className="summarization-banner">
      <svg 
        className="summarization-banner-icon" 
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 16 16" 
        fill="none"
      >
        <path 
          d="M3 2C3 1.44772 3.44772 1 4 1H9L13 5V14C13 14.5523 12.5523 15 12 15H4C3.44772 15 3 14.5523 3 14V2Z" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinejoin="round"
        />
        <path 
          d="M9 1V4C9 4.55228 9.44772 5 10 5H13" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinejoin="round"
        />
        <path 
          d="M5 8H11M5 11H9" 
          stroke="currentColor" 
          strokeWidth="1.2" 
          strokeLinecap="round"
        />
      </svg>
      <span className="summarization-banner-text">Summarize: {preview}</span>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Show loader in empty assistant message (streaming starting)
  const isStreamingEmpty = message.role === 'assistant' && message.content === '';

  // Check if this is a summarization message that should be collapsed
  const shouldShowBanner = message.isSummarization && message.role === 'user' && message.summarizationPreview;

  // Add aborted class if message was aborted
  const messageClasses = `chat-message ${message.role}${message.isAborted ? ' aborted' : ''}`;

  return (
    <div className={messageClasses}>
      <div className="chat-message-content">
        {shouldShowBanner ? (
          <SummarizationBanner preview={message.summarizationPreview || ''} />
        ) : isStreamingEmpty ? (
          <div className="loading-indicator">
            <Loader size={24} color="primary" />
          </div>
        ) : (
          <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[rehypeHighlight]}
          >
            {message.content}
          </ReactMarkdown>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;


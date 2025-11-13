import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import { ChatMessage as ChatMessageType } from '@/types';
import { FileIconType } from '@/components/app/files/components/file-item';
import { GlobalLoader } from '@/components/app/global-loader';
import CopyButton from '@/components/app/copy-button';

interface ChatMessageProps {
  message: ChatMessageType;
}

const SummarizationBanner: React.FC<{ preview: string; favicon?: string }> = ({
  preview,
  favicon,
}) => {
  return (
    <div className="summarization-banner">
      {favicon && <img src={favicon} alt={preview} className="favicon-styles" />}
      <span className="summarization-banner-text">
        <span style={{ fontWeight: 500 }}>Summarize:</span> {preview}
      </span>
    </div>
  );
};

const FileAttachmentBanner: React.FC<{ files: string[] }> = ({ files }) => {
  const fileText = files.length === 1 ? files[0] : `${files.length} files (${files.join(', ')})`;
  const lastDot = fileText.lastIndexOf('.');
  const type = lastDot !== -1 ? fileText.substring(lastDot + 1) : '';

  return (
    <div className="file-attachment-banner">
      <FileIconType type={type} />
      <div className="file-attachment-banner-text-container">
        <div className="summarization-banner-text file-attachment-banner-text">{fileText}</div>
        {type && <div className="file-attachment-banner-text-type">{type}</div>}
      </div>
    </div>
  );
};

const PageContextBanner: React.FC<{
  pageContext: { title: string; url: string; favicon?: string };
}> = ({ pageContext }) => {
  return (
    <div className="summarization-banner page-context-banner">
      {pageContext.favicon && (
        <img src={pageContext.favicon} alt={pageContext.title} className="favicon-styles" />
      )}
      <span className="summarization-banner-text">{pageContext.title}</span>
    </div>
  );
};

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  // Show loader in empty assistant message (streaming starting)
  const isStreamingEmpty = message.role === 'assistant' && message.content === '';

  // Check if this is a summarization message that should be collapsed
  const shouldShowSummarizationBanner =
    message.isSummarization && message.role === 'user' && message.summarizationPreview;

  // Check if this is a file attachment message that should show file banner
  const shouldShowFileBanner =
    message.hasAttachedFiles &&
    message.role === 'user' &&
    message.attachedFilesPreview &&
    message.attachedFilesPreview.length > 0;

  // Check if this is a page context message that should show page context banner
  const shouldShowPageContextBanner =
    message.hasPageContext && message.role === 'user' && message.pageContextPreview;

  // Add aborted class if message was aborted
  const messageClasses = `chat-message ${message.role}${message.isAborted ? ' aborted' : ''}`;
  const isAssistant = message.role === 'assistant';

  return (
    <div className="chat-message-container">
      {shouldShowFileBanner && (
        <div className="file-attachment-banner-container">
          <FileAttachmentBanner files={message.attachedFilesPreview || []} />
        </div>
      )}
      <div className={messageClasses}>
        <div className="chat-message-content">
          {shouldShowSummarizationBanner && (
            <SummarizationBanner
              preview={message.summarizationPreview || ''}
              favicon={message.favicon}
            />
          )}
          {shouldShowPageContextBanner && (
            <PageContextBanner pageContext={message.pageContextPreview!} />
          )}
          {(shouldShowFileBanner || shouldShowPageContextBanner) && message.displayContent && (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.displayContent}
            </ReactMarkdown>
          )}
          {isStreamingEmpty ? (
            <GlobalLoader />
          ) : !shouldShowFileBanner && !shouldShowPageContextBanner ? (
            <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeHighlight]}>
              {message.content}
            </ReactMarkdown>
          ) : null}
        </div>
      </div>

      {isAssistant && (
        <div className="chat-message-buttons">
          <CopyButton text={message.content} />
        </div>
      )}
    </div>
  );
};

export default ChatMessage;

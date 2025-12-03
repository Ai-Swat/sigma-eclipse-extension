import React, { useState } from 'react';
import SmartTextarea from 'src/components/app/smart-textarea';
import { FileContextProvider, useFileContext } from '@/sidepanel/contexts/fileContext';
import { PageContextProvider, usePageContext } from '@/sidepanel/contexts/pageContext.tsx';
import { useModelContext } from '@/sidepanel/contexts/modelContext.tsx';
import { TabInfoHeader } from '@/components/app/tab-info-block';
import { ScrollDownButton } from '@/components/app/scroll-down-button';
import { SubmitRequest } from '@/components/app/smart-textarea/components/submit-request';
import styles from './MessageInputWrapper.module.css';

interface MessageMetadata {
  hasAttachedFiles?: boolean;
  attachedFilesPreview?: string[];
  displayContent?: string;
  hasPageContext?: boolean;
  pageContextPreview?: { title: string; url: string; favicon?: string };
}

interface MessageInputWrapperProps {
  onSendMessage: (message: string, targetChatId?: string, metadata?: MessageMetadata) => void;
  disabled: boolean;
  isGenerating?: boolean;
  onStopGeneration?: () => void;
}

// Inner component with access to FileContext and PageContext
const MessageInputInner: React.FC<MessageInputWrapperProps> = ({
  onSendMessage,
  disabled,
  isGenerating = false,
  onStopGeneration,
}) => {
  const [message, setMessage] = useState('');
  const [isShowSubmitRequest, setIsShowSubmitRequest] = useState(false);
  const isActiveSendButton = message.trim().length > 0 && !disabled;

  const { uploadedFiles, clearFiles } = useFileContext();
  const { pageContext, isAttached, detachContext } = usePageContext();
  const { modelStatus } = useModelContext();

  const handleSend = () => {
    if (modelStatus !== 'running') {
      setIsShowSubmitRequest(true);
      return;
    }

    if (message.trim() && !disabled) {
      let fullContent = message;
      const metadata: MessageMetadata = {
        displayContent: message,
      };

      // Check if there are files with extracted text
      const processedFiles = uploadedFiles.filter(file => file.extractedText && !file.isExtracting);

      if (processedFiles.length > 0) {
        // Collect extracted text from all files
        const filesText = processedFiles
          .map(file => {
            const fileName = file.name;
            const text = file.extractedText;
            return `\n\n---\nFile: ${fileName}\n${text}\n---`;
          })
          .join('\n');

        fullContent += filesText;

        // File names for display banner (without showing full content)
        const fileNames = processedFiles.map(file => file.name);

        metadata.hasAttachedFiles = true;
        metadata.attachedFilesPreview = fileNames;
      }

      // Check if page context is attached
      if (isAttached && pageContext) {
        const pageContextText = `\n\n---\nPage Context:\nTitle: ${pageContext.title}\nURL: ${pageContext.url}\nContent: ${pageContext.content}\n---`;
        fullContent += pageContextText;

        metadata.hasPageContext = true;
        metadata.pageContextPreview = {
          title: pageContext.title,
          url: pageContext.url,
          favicon: pageContext.favicon,
        };

        // Detach context after sending
        detachContext();
      }

      // Send with metadata
      onSendMessage(fullContent, undefined, metadata);

      setMessage('');
      clearFiles(); // Clear files after sending
    }
  };

  const handleChange = (value: string) => {
    setMessage(value);
  };

  const handleClear = () => {
    setMessage('');
  };

  return (
    <>
      <SubmitRequest isOpen={isShowSubmitRequest} setIsOpen={setIsShowSubmitRequest} />

      <TabInfoHeader />
      <SmartTextarea
        value={message}
        onChange={handleChange}
        onClear={handleClear}
        onEnter={handleSend}
        placeholder="Type your message..."
        isActiveSendButton={isActiveSendButton}
        isDisabled={disabled}
        isMainPage={false}
        isGenerating={isGenerating}
        onStopGeneration={onStopGeneration}
      />
    </>
  );
};

const MessageInputWrapper: React.FC<MessageInputWrapperProps> = props => {
  return (
    <div className={styles.wrapper}>
      <ScrollDownButton />

      <PageContextProvider>
        <FileContextProvider>
          <MessageInputInner {...props} />
        </FileContextProvider>
      </PageContextProvider>
    </div>
  );
};

export default MessageInputWrapper;

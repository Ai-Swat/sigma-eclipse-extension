import React, { useState } from 'react';
import SmartTextarea from 'src/components/app/smart-textarea';
import { FileContextProvider, useFileContext } from 'src/contexts/fileContext';
import styles from './MessageInputWrapper.module.css';

interface MessageMetadata {
  hasAttachedFiles?: boolean;
  attachedFilesPreview?: string[];
  displayContent?: string;
}

interface MessageInputWrapperProps {
  onSendMessage: (
    message: string, 
    targetChatId?: string,
    metadata?: MessageMetadata
  ) => void;
  disabled: boolean;
  isGenerating?: boolean;
  onStopGeneration?: () => void;
}

// Inner component with access to FileContext
const MessageInputInner: React.FC<MessageInputWrapperProps> = ({ 
  onSendMessage, 
  disabled,
  isGenerating = false,
  onStopGeneration
}) => {
  const [message, setMessage] = useState('');
  const { uploadedFiles, clearFiles } = useFileContext();

  const handleSend = () => {
    if (message.trim() && !disabled) {
      // Check if there are files with extracted text
      const processedFiles = uploadedFiles.filter(
        file => file.extractedText && !file.isExtracting
      );
      
      if (processedFiles.length > 0) {
        // Collect extracted text from all files
        const filesText = processedFiles
          .map(file => {
            const fileName = file.name;
            const text = file.extractedText;
            return `\n\n---\nFile: ${fileName}\n${text}\n---`;
          })
          .join('\n');

        // Create message with files metadata
        // Content includes both user message and file texts (for AI to process)
        const fullContent = `${message}${filesText}`;
        
        // File names for display banner (without showing full content)
        const fileNames = processedFiles.map(file => file.name);
        
        // Send with metadata about attached files
        onSendMessage(fullContent, undefined, {
          hasAttachedFiles: true,
          attachedFilesPreview: fileNames,
          displayContent: message, // Store user's message separately for display
        });
      } else {
        // No files, send message as is
        onSendMessage(message);
      }
      
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

  const isActiveSendButton = message.trim().length > 0 && !disabled;

  return (
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
  );
};

const MessageInputWrapper: React.FC<MessageInputWrapperProps> = (props) => {
  return (
    <div className={styles.wrapper}>
      <FileContextProvider>
        <MessageInputInner {...props} />
      </FileContextProvider>
    </div>
  );
};

export default MessageInputWrapper;


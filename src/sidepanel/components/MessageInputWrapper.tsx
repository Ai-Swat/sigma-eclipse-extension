import React, { useState } from 'react';
import SmartTextarea from 'src/components/app/smart-textarea';
import { FileContextProvider } from 'src/contexts/fileContext';
import styles from './MessageInputWrapper.module.css';

interface MessageInputWrapperProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const MessageInputWrapper: React.FC<MessageInputWrapperProps> = ({ 
  onSendMessage, 
  disabled 
}) => {
  const [message, setMessage] = useState('');

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
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
    <div className={styles.wrapper}>
      <FileContextProvider>
        <SmartTextarea
          value={message}
          onChange={handleChange}
          onClear={handleClear}
          onEnter={handleSend}
          placeholder="Type your message..."
          isActiveSendButton={isActiveSendButton}
          isDisabled={disabled}
          isMainPage={false}
        />
      </FileContextProvider>
    </div>
  );
};

export default MessageInputWrapper;


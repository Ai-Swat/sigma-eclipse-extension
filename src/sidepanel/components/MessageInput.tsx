import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from './ui/Textarea';
import BaseButton from './ui/BaseButton';

interface MessageInputProps {
  onSendMessage: (message: string) => void;
  disabled: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled }) => {
  const [message, setMessage] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSend = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  useEffect(() => {
    // Auto-resize textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [message]);

  return (
    <div className="message-input-container">
      <Textarea
        ref={textareaRef}
        className="message-textarea"
        placeholder="Type your message..."
        value={message}
        onChange={setMessage}
        onEnter={handleSend}
        disabled={disabled}
        rows={1}
      />
      <BaseButton
        className="message-send-button"
        onClick={handleSend}
        isDisabled={disabled || !message.trim()}
        color="primary"
        size="m"
        label="Send message"
      >
        <span>▶️</span>
      </BaseButton>
    </div>
  );
};

export default MessageInput;


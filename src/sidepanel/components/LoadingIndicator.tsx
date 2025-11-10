import React from 'react';
import { Loader } from './new-components/ui/loader';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="chat-message assistant">
      <div className="chat-message-content">
        <div className="loading-indicator">
          <Loader size={32} color="primary" />
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;


import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="chat-message assistant">
      <div className="chat-message-content">
        <div className="loading-indicator">
          <div className="loading-indicator-dot"></div>
          <div className="loading-indicator-dot"></div>
          <div className="loading-indicator-dot"></div>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;


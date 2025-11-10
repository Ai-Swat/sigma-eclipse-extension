import React from 'react';

const LoadingIndicator: React.FC = () => {
  return (
    <div className="message assistant">
      <div className="message-content">
        <div className="loading-dots">
          <span>●</span>
          <span>●</span>
          <span>●</span>
        </div>
      </div>
    </div>
  );
};

export default LoadingIndicator;


import React from 'react';

interface HeaderProps {
  onToggleContext: () => void;
  onToggleTranslation: () => void;
  onSettings: () => void;
  contextEnabled: boolean;
  translationMode: boolean;
}

const Header: React.FC<HeaderProps> = ({
  onToggleContext,
  onToggleTranslation,
  onSettings,
  contextEnabled,
  translationMode
}) => {
  return (
    <header className="header">
      <h1>⚙️ Sigma Private</h1>
      <div className="header-actions">
        <button
          className={`icon-btn ${contextEnabled ? 'active' : ''}`}
          title="Toggle page context"
          onClick={onToggleContext}
        >
          <span>📄</span>
        </button>
        <button
          className={`icon-btn ${translationMode ? 'active' : ''}`}
          title="Translation mode"
          onClick={onToggleTranslation}
        >
          <span>🌐</span>
        </button>
        <button
          className="icon-btn"
          title="Settings"
          onClick={onSettings}
        >
          <span>⚙️</span>
        </button>
      </div>
    </header>
  );
};

export default Header;


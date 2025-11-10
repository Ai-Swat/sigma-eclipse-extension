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
    <header className="app-header">
      <h1 className="app-header-title">
        <span>⚙️</span>
        <span>Sigma Private</span>
      </h1>
      <div className="app-header-actions">
        <button
          className={`icon-button ${contextEnabled ? 'active' : ''}`}
          title="Toggle page context"
          onClick={onToggleContext}
        >
          <span>📄</span>
        </button>
        <button
          className={`icon-button ${translationMode ? 'active' : ''}`}
          title="Translation mode"
          onClick={onToggleTranslation}
        >
          <span>🌐</span>
        </button>
        <button
          className="icon-button"
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


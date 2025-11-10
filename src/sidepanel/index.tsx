import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './styles/index.css';

// Auto-detect and apply theme based on system preferences
const applyTheme = () => {
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.className = isDark ? 'theme-dark' : 'theme-white';
};

// Apply theme on load
applyTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', applyTheme);

const container = document.getElementById('root');
if (!container) {
  throw new Error('Root element not found');
}

const root = createRoot(container);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);


// CSS styles for translation UI

/**
 * Inject translation styles into the page
 * Only injects once to avoid duplicates
 */
export function injectTranslationStyles(): void {
  if (document.getElementById('sigma-translation-styles')) return;

  const style = document.createElement('style');
  style.id = 'sigma-translation-styles';
  style.textContent = `
    body.sigma-no-scroll {
      overflow: hidden !important;
    }

    .sigma-translate-bubble {
      position: absolute;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      z-index: 9999990;
      box-shadow:
        0 6px 12px rgba(0, 0, 0, 0.08),
        0 2px 4px rgba(0, 0, 0, 0.06);
      opacity: 0;
      transform: scale(0.9);
      transition: 
        box-shadow 0.3s ease,
        transform 0.3s ease,
        opacity 0.4s ease;
      user-select: none;
      pointer-events: auto;
      animation: sigma-fade-in 0.4s ease forwards;
    }

    .sigma-translate-bubble:hover {
      transform: scale(1.1);
      box-shadow:
        0 8px 18px rgba(0, 0, 0, 0.12),
        0 4px 8px rgba(0, 0, 0, 0.08),
        0 0 12px rgba(118, 75, 162, 0.3);
    }

    .sigma-translate-bubble svg {
      width: 22px;
      height: 22px;
      fill: white;
      transition: transform 0.3s ease;
    }

    .sigma-translate-bubble:hover svg {
      transform: scale(1.05);
    }

    @keyframes sigma-fade-in {
      0% {
        opacity: 0;
        transform: scale(0.9);
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }

    .sigma-translate-popup-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0, 0, 0, 0.45);
      z-index: 9999998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(5px);
      animation: sigma-overlay-fade 0.35s ease forwards;
    }

    @keyframes sigma-overlay-fade {
      from { opacity: 0; }
      to { opacity: 1; }
    }

    .sigma-translate-popup {
      background: #ffffff;
      color: #000000;
      border-radius: 18px;
      padding: 28px;
      max-width: 640px;
      width: 100%;
      box-shadow:
        0 20px 50px rgba(0, 0, 0, 0.25),
        0 6px 12px rgba(0, 0, 0, 0.1);
      z-index: 9999999;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
      opacity: 0;
      transform: translateY(12px) scale(0.98);
      animation: sigma-popup-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) forwards;
      transition: box-shadow 0.3s ease;
    }

    .sigma-translate-popup:hover {
      box-shadow:
        0 24px 60px rgba(0, 0, 0, 0.28),
        0 8px 20px rgba(0, 0, 0, 0.1);
    }
    
    .sigma-translate-popup-container {
      overflow-y: auto;
      max-height: 80vh;
    }
    
    .sigma-translate-popup-container::-webkit-scrollbar {
      width: 8px;
    }
    .sigma-translate-popup-container::-webkit-scrollbar-thumb {
      background: #ccc;
      border-radius: 4px;
    }
    .sigma-translate-popup-container::-webkit-scrollbar-thumb:hover {
      background: #aaa;
    }

    @keyframes sigma-popup-in {
      from {
        opacity: 0;
        transform: translateY(12px) scale(0.98);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    .sigma-translate-popup-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }

    .sigma-translate-popup-title {
      font-size: 20px;
      font-weight: 600;
      color: #1a1a1a;
      letter-spacing: -0.2px;
    }

    .sigma-translate-popup-close {
      background: transparent;
      border: none;
      width: 34px;
      height: 34px;
      cursor: pointer;
      font-size: 28px;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .sigma-translate-popup-close:hover {
      color: #222;
    }

    .sigma-translate-section {
      margin-bottom: 24px;
    }

    .sigma-translate-section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #4d576aff;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .sigma-translate-text-box {
      border-radius: 12px;
      padding: 16px;
      font-size: 15px;
      line-height: 1.6;
      background: #f6f6f6ff;
      color: #000000;
    }

    .sigma-translate-loading {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      color: #3c3e41ff;
      font-size: 15px;
    }

    .sigma-translate-spinner {
      border: 3px solid #4d576a12;
      border-top: 3px solid #148eff;
      border-radius: 50%;
      width: 32px;
      height: 32px;
      animation: sigma-spin 1s linear infinite;
      margin-bottom: 8px;
      margin-right: 8px;
    }

    @keyframes sigma-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .sigma-translate-error span {
      margin-right: 6px;
    }
  `;

  document.head.appendChild(style);
}

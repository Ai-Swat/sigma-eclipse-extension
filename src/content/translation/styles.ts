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
    .sigma-translate-bubble {
      position: absolute;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 0;
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
        0 4px 8px rgba(0, 0, 0, 0.08);
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
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(0, 0, 0, 0.5);
      z-index: 9999998;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      backdrop-filter: blur(4px);
      animation: sigma-fade-in 0.3s ease forwards;
    }

    .sigma-translate-popup {
      background: white;
      border-radius: 16px;
      padding: 24px;
      max-width: 600px;
      width: 100%;
      max-height: 80vh;
      overflow-y: auto;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
      z-index: 9999999;
      font-family: -apple-system, system-ui, Helvetica, Arial;
      opacity: 0;
      transform: translateY(10px);
      animation: sigma-popup-in 0.35s ease forwards;
    }

    @keyframes sigma-popup-in {
      0% {
        opacity: 0;
        transform: translateY(10px);
      }
      100% {
        opacity: 1;
        transform: translateY(0);
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
    }

    .sigma-translate-popup-close {
      background: #f5f5f5;
      border: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      cursor: pointer;
      font-size: 20px;
      color: #666;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.25s ease;
    }

    .sigma-translate-popup-close:hover {
      background: #e5e5e5;
      color: #333;
      transform: rotate(90deg);
    }

    .sigma-translate-section {
      margin-bottom: 20px;
    }

    .sigma-translate-section-title {
      font-size: 12px;
      font-weight: 600;
      text-transform: uppercase;
      color: #666;
      margin-bottom: 8px;
      letter-spacing: 0.5px;
    }

    .sigma-translate-text-box {
      background: #f8f9fa;
      border-radius: 12px;
      padding: 16px;
      font-size: 15px;
      line-height: 1.6;
      color: #333;
      border: 1px solid #e0e0e0;
    }

    .sigma-translate-loading {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 40px;
      color: #666;
    }

    .sigma-translate-spinner {
      border: 3px solid #f3f3f3;
      border-top: 3px solid #667eea;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      animation: sigma-spin 1s linear infinite;
      margin-bottom: 12px;
    }

    @keyframes sigma-spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .sigma-translate-error {
      background: #fee;
      color: #c33;
      padding: 12px;
      border-radius: 8px;
      font-size: 14px;
    }
  `;

  document.head.appendChild(style);
}

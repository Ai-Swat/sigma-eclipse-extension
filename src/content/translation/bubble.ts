// Translation bubble component

import { showTranslationPopup } from './popup';

let translationBubble: HTMLElement | null = null;

/**
 * Create translation bubble element with icon
 */
function createTranslationBubble(x: number, y: number): HTMLElement {
  const bubble = document.createElement('div');
  bubble.className = 'sigma-translate-bubble';

  // SVG icon with hieroglyph (文) and letter (A)
  bubble.innerHTML = `
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path d="M12.87 15.07l-2.54-2.51.03-.03c1.74-1.94 2.98-4.17 3.71-6.53H17V4h-7V2H8v2H1v1.99h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"/>
    </svg>
  `;

  bubble.style.left = `${x}px`;
  bubble.style.top = `${y}px`;
  bubble.style.position = 'absolute';
  bubble.style.zIndex = '9999990';

  bubble.addEventListener(
    'click',
    e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
      console.log('🌐 Translation bubble clicked');
      removeTranslationBubble(); // Remove bubble first
      showTranslationPopup();
    },
    true
  );

  bubble.addEventListener(
    'mousedown',
    e => {
      e.preventDefault();
      e.stopPropagation();
      e.stopImmediatePropagation();
    },
    true
  );

  return bubble;
}

/**
 * Show translation bubble near selected text
 */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
export function showTranslationBubble(mouseX: number, mouseY: number, selectedText: string): void {
  console.log('🎯 showTranslationBubble called');
  console.log('📋 Selected text:', selectedText);

  if (!selectedText || selectedText.length === 0) {
    console.log('⚠️ No text selected, removing bubble');
    removeTranslationBubble();
    return;
  }

  // Remove existing bubble
  removeTranslationBubble();

  // Create and position bubble
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0) return;

  const range = selection.getRangeAt(0);
  const rect = range.getBoundingClientRect();

  const x = rect.left + rect.width / 2 - 50 + window.scrollX;
  const y = rect.bottom + 10 + window.scrollY;

  console.log('📍 Bubble position:', { x, y });

  translationBubble = createTranslationBubble(x, y);
  document.body.appendChild(translationBubble);

  console.log('✅ Translation bubble added to DOM', translationBubble);
}

/**
 * Remove translation bubble from DOM
 */
export function removeTranslationBubble(): void {
  if (translationBubble) {
    console.log('🗑️ Removing translation bubble');
    translationBubble.remove();
    translationBubble = null;
    console.log('✅ Translation bubble removed');
  }
}

/**
 * Check if element is the translation bubble
 */
export function isTranslationBubble(element: Node): boolean {
  return translationBubble !== null && translationBubble.contains(element);
}

// Event handlers for translation feature

import { showTranslationBubble, removeTranslationBubble, isTranslationBubble } from './bubble';
import { setCurrentSelectedText } from './popup';

let mouseUpTimeout: number | null = null;

/**
 * Handle mouseup event to show translation bubble
 */
function handleMouseUp(e: MouseEvent): void {
  console.log('🖱️ mouseup event detected');

  // Clear previous timeout
  if (mouseUpTimeout) {
    clearTimeout(mouseUpTimeout);
  }

  // Longer delay to ensure selection is complete
  mouseUpTimeout = window.setTimeout(() => {
    const selection = window.getSelection();
    const selectedText = selection?.toString().trim();
    console.log('📝 Selection after delay:', selectedText);

    if (selectedText && selectedText.length > 0) {
      setCurrentSelectedText(selectedText);
      showTranslationBubble(e.clientX, e.clientY, selectedText);
    } else {
      console.log('⚠️ Still no selection after delay');
      removeTranslationBubble();
    }
  }, 150); // Increased delay to 150ms
}

/**
 * Handle mousedown event to remove bubble when starting new selection
 */
function handleMouseDown(e: MouseEvent): void {
  // Don't remove bubble if clicking on the bubble itself
  if (isTranslationBubble(e.target as Node)) {
    console.log('👆 Clicked on translation bubble - keeping it');
    return;
  }

  if (mouseUpTimeout) {
    clearTimeout(mouseUpTimeout);
  }
  removeTranslationBubble();
}

/**
 * Initialize translation event handlers
 */
export function initTranslationEventHandlers(): void {
  console.log('🔧 Initializing translation event handlers...');

  document.addEventListener('mouseup', handleMouseUp);
  console.log('✅ Translation mouseup listener added');

  document.addEventListener('mousedown', handleMouseDown);
  console.log('✅ Translation mousedown listener added');
}

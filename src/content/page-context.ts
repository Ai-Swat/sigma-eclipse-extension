// Page context extraction utilities

import { PageContext } from './types';

/**
 * Get current page context including URL, title, content, and selected text
 */
export function getPageContext(): PageContext {
  // Get page title
  const title = document.title;

  // Get page URL
  const url = window.location.href;

  // Get main text content
  const content = extractMainContent();

  // Get selected text if any
  const selectedText = window.getSelection()?.toString() || undefined;

  return {
    url,
    title,
    content,
    selectedText,
  };
}

/**
 * Extract main content from page by checking common content elements
 */
function extractMainContent(): string {
  // Try to get main content from common elements
  const mainElements = [
    document.querySelector('main'),
    document.querySelector('article'),
    document.querySelector('[role="main"]'),
    document.querySelector('.content'),
    document.querySelector('#content'),
    document.body,
  ];

  let content = '';

  for (const element of mainElements) {
    if (element) {
      content = extractTextFromElement(element);
      if (content.length > 100) break; // Found substantial content
    }
  }

  return content.substring(0, 10000); // Limit to 10000 chars
}

/**
 * Extract text from DOM element, removing scripts, styles, and other non-content elements
 */
function extractTextFromElement(element: Element): string {
  // Clone the element to avoid modifying the actual DOM
  const clone = element.cloneNode(true) as Element;

  // Remove script, style, and other non-content elements
  const elementsToRemove = clone.querySelectorAll(
    'script, style, nav, header, footer, aside, noscript, iframe'
  );
  elementsToRemove.forEach(el => el.remove());

  // Get text content and clean it up
  let text = clone.textContent || '';

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  return text;
}

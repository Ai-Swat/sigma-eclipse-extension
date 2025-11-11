// Content script for Sigma Private - runs on all web pages

// Prevent multiple injections
if ((window as any).__SIGMA_PRIVATE_CONTENT_SCRIPT_LOADED__) {
  console.log('⚠️ Sigma Private content script already loaded, skipping');
} else {
  (window as any).__SIGMA_PRIVATE_CONTENT_SCRIPT_LOADED__ = true;
  console.log('✅ Sigma Private content script loaded');
}

// Local types (inlined to avoid bundler creating shared chunks)
interface PageContext {
  url: string;
  title: string;
  content: string;
  selectedText?: string;
}

// Listen for messages from background script
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('📨 Content script received message:', message.type);
  
  if (message.type === 'GET_PAGE_CONTEXT') {
    try {
      const context = getPageContext();
      console.log('✅ Sending page context:', {
        url: context.url,
        title: context.title,
        contentLength: context.content.length,
        hasSelection: !!context.selectedText
      });
      sendResponse(context);
    } catch (error) {
      console.error('❌ Error getting page context:', error);
      sendResponse(null);
    }
    return true;
  }
});

function getPageContext(): PageContext {
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
    selectedText
  };
}

function extractMainContent(): string {
  // Try to get main content from common elements
  const mainElements = [
    document.querySelector('main'),
    document.querySelector('article'),
    document.querySelector('[role="main"]'),
    document.querySelector('.content'),
    document.querySelector('#content'),
    document.body
  ];

  let content = '';

  for (const element of mainElements) {
    if (element) {
      content = extractTextFromElement(element);
      if (content.length > 100) break; // Found substantial content
    }
  }

  return content.substring(0, 10000); // Limit to 5000 chars
}

function extractTextFromElement(element: Element): string {
  // Clone the element to avoid modifying the actual DOM
  const clone = element.cloneNode(true) as Element;

  // Remove script, style, and other non-content elements
  const elementsToRemove = clone.querySelectorAll('script, style, nav, header, footer, aside, noscript, iframe');
  elementsToRemove.forEach(el => el.remove());

  // Get text content and clean it up
  let text = clone.textContent || '';
  
  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();
  
  return text;
}

// Add context menu for translation (future enhancement)
document.addEventListener('mouseup', () => {
  const selectedText = window.getSelection()?.toString();
  if (selectedText && selectedText.length > 0) {
    // Could show a floating button for quick translation
    // This is a placeholder for future implementation
  }
});

// Observe DOM changes to update context if needed
const observer = new MutationObserver((mutations) => {
  // This could be used to detect significant page changes
  // and update cached context
});

// Start observing if needed
// observer.observe(document.body, { childList: true, subtree: true });


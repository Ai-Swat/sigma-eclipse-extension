// Handler for page context operations

import { PageContext, MessageType } from '../types';

export async function handleGetPageContext(
  _sender: chrome.runtime.MessageSender
): Promise<PageContext | null> {
  return await getActiveTabContext();
}

export async function getActiveTabContext(): Promise<PageContext | null> {
  try {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    if (!tab || !tab.id) return null;

    // Send message to content script to get page content
    const response = await chrome.tabs.sendMessage(tab.id, {
      type: MessageType.GET_PAGE_CONTEXT,
    });

    return response;
  } catch (error) {
    console.error('Error getting page context:', error);
    return null;
  }
}

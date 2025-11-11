// Handler for context menu and installation events

import { MessageType } from '../types';

export function setupContextMenus(): void {
  // Add context menu items
  chrome.contextMenus.create({
    id: 'openSidePanel',
    title: 'Open Sigma Private Sidebar',
    contexts: ['all']
  });
  
  chrome.contextMenus.create({
    id: 'summarizePage',
    title: 'Summarize page',
    contexts: ['page', 'selection']
  });
}

export function handleContextMenuClick(info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab): void {
  if (info.menuItemId === 'openSidePanel' && tab?.id) {
    chrome.sidePanel.open({ tabId: tab.id }).catch((error) => {
      console.error('Error opening side panel from context menu:', error);
    });
  } else if (info.menuItemId === 'summarizePage' && tab?.id) {
    // Open side panel first
    chrome.sidePanel.open({ tabId: tab.id }).then(() => {
      // Wait for sidepanel to initialize before sending message
      setTimeout(() => {
        chrome.runtime.sendMessage({
          type: MessageType.SUMMARIZE_PAGE,
          payload: { tabId: tab.id }
        }).catch((error) => {
          console.error('Error sending summarize message:', error);
        });
      }, 500); // Give sidepanel time to mount and register listeners
    }).catch((error) => {
      console.error('Error opening side panel for summarization:', error);
    });
  }
}

export function handleInstallation(details: chrome.runtime.InstalledDetails): void {
  if (details.reason === 'install') {
    console.log('Sigma Private extension installed');
    // Open options page or welcome page
    chrome.storage.local.set({
      settings: {
        apiKey: '',
        model: 'gpt-4',
        language: 'en'
      }
    });
  } else if (details.reason === 'update') {
    console.log('Sigma Private extension updated');
  }
  
  setupContextMenus();
}


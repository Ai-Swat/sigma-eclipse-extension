// Background service worker for Sigma Eclipse extension

import { MessageType } from './types';
import { handleChatRequest } from './handlers/chat-handler';
import { handleGetPageContext } from './handlers/context-handler';
import { handleTranslation } from './handlers/translation-handler';
import { handleInstallation, handleContextMenuClick } from './handlers/menu-handler';
import { sigmaEclipseClient } from './sigma-eclipse-client';

console.log('Sigma Eclipse background service worker initialized');

// ============== Background Status Monitoring ==============

interface CachedStatus {
  hostAvailable: boolean | null;
  appRunning: boolean;
  modelRunning: boolean;
  isDownloading: boolean;
  downloadProgress: number | null;
  lastCheck: number;
}

let cachedStatus: CachedStatus = {
  hostAvailable: null,
  appRunning: false,
  modelRunning: false,
  isDownloading: false,
  downloadProgress: null,
  lastCheck: 0,
};

const STATUS_CHECK_ALARM = 'sigma-status-check';
const STATUS_CHECK_INTERVAL_MINUTES = 0.02; // Every 30 seconds

// Check status and broadcast changes
async function checkAndBroadcastStatus() {
  try {
    // First check if host is available
    const hostCheck = await sigmaEclipseClient.checkHostAvailable();
    const newHostAvailable = hostCheck.available;

    // If host is not available, broadcast that and skip other checks
    if (!newHostAvailable) {
      const hostChanged = cachedStatus.hostAvailable !== newHostAvailable;

      cachedStatus = {
        ...cachedStatus,
        hostAvailable: newHostAvailable,
        appRunning: false,
        modelRunning: false,
        isDownloading: false,
        downloadProgress: null,
        lastCheck: Date.now(),
      };

      if (hostChanged || cachedStatus.hostAvailable === null) {
        console.log('[Background] Host not available:', hostCheck.error);

        chrome.runtime
          .sendMessage({
            type: 'STATUS_UPDATE',
            data: {
              hostAvailable: false,
              hostError: hostCheck.error,
              appRunning: false,
              modelRunning: false,
              isDownloading: false,
              downloadProgress: null,
              hostChanged: true,
            },
          })
          .catch(() => {
            // No listeners, ignore
          });
      }
      return;
    }

    // Host is available, check other statuses
    const [appStatus, modelStatus, downloadStatus] = await Promise.all([
      sigmaEclipseClient.getAppStatus().catch(() => ({ is_running: false })),
      sigmaEclipseClient.getStatus().catch(() => ({ is_running: false })),
      sigmaEclipseClient.isDownloading().catch(() => ({ is_downloading: false, progress: null })),
    ]);

    const newAppRunning = appStatus.is_running;
    const newModelRunning = modelStatus.is_running;
    const newIsDownloading = downloadStatus.is_downloading;
    const newDownloadProgress = downloadStatus.progress;

    // Check if status changed
    const hostChanged = cachedStatus.hostAvailable !== newHostAvailable;
    const appChanged = cachedStatus.appRunning !== newAppRunning;
    const modelChanged = cachedStatus.modelRunning !== newModelRunning;
    const downloadChanged = cachedStatus.isDownloading !== newIsDownloading;
    const progressChanged = cachedStatus.downloadProgress !== newDownloadProgress;

    // Update cache
    cachedStatus = {
      hostAvailable: newHostAvailable,
      appRunning: newAppRunning,
      modelRunning: newModelRunning,
      isDownloading: newIsDownloading,
      downloadProgress: newDownloadProgress,
      lastCheck: Date.now(),
    };

    // Broadcast status change to all extension pages
    if (hostChanged || appChanged || modelChanged || downloadChanged || progressChanged) {
      console.log('[Background] Status changed:', {
        hostAvailable: newHostAvailable,
        appRunning: newAppRunning,
        modelRunning: newModelRunning,
        isDownloading: newIsDownloading,
        downloadProgress: newDownloadProgress,
      });

      chrome.runtime
        .sendMessage({
          type: 'STATUS_UPDATE',
          data: {
            hostAvailable: newHostAvailable,
            appRunning: newAppRunning,
            modelRunning: newModelRunning,
            isDownloading: newIsDownloading,
            downloadProgress: newDownloadProgress,
            hostChanged,
            appChanged,
            modelChanged,
            downloadChanged,
          },
        })
        .catch(() => {
          // No listeners, ignore
        });
    }
  } catch (err) {
    console.warn('[Background] Status check failed:', err);
  }
}

// Setup alarm for periodic status check
chrome.alarms.create(STATUS_CHECK_ALARM, {
  delayInMinutes: 0.02, // Start checking after 6 seconds
  periodInMinutes: STATUS_CHECK_INTERVAL_MINUTES,
});

chrome.alarms.onAlarm.addListener(alarm => {
  if (alarm.name === STATUS_CHECK_ALARM) {
    checkAndBroadcastStatus();
  }
});

// Initial status check
checkAndBroadcastStatus();

// Handle action button click - open side panel
chrome.action.onClicked.addListener(tab => {
  if (tab.id) {
    chrome.sidePanel.open({ tabId: tab.id }).catch(error => {
      console.error('Error opening side panel:', error);
    });
  }
});

// Handle messages from popup and content scripts
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log('Received message:', message.type);

  switch (message.type) {
    case MessageType.CHAT_REQUEST:
      handleChatRequest(message.payload, sender)
        .then(sendResponse)
        .catch(error => {
          console.error('Chat request error:', error);
          sendResponse({ error: error.message });
        });
      return true; // Keep channel open for async response

    case MessageType.GET_PAGE_CONTEXT:
      handleGetPageContext(sender)
        .then(sendResponse)
        .catch(error => {
          console.error('Get context error:', error);
          sendResponse({ error: error.message });
        });
      return true;

    case MessageType.TRANSLATE_TEXT:
      handleTranslation(message, sender.tab?.id)
        .then(sendResponse)
        .catch(error => {
          console.error('Translation error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case MessageType.SUMMARIZE_PAGE:
      // This message is handled by the sidepanel directly
      // Background script just passes it through
      sendResponse({ success: true });
      return true;

    case MessageType.MODEL_START:
      // First ensure app is running, then start the server
      (async () => {
        try {
          await sigmaEclipseClient.ensureAppRunning();
          const data = await sigmaEclipseClient.startServer();
          sendResponse({ success: true, data });
        } catch (error) {
          console.error('Model start error:', error);
          sendResponse({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
          });
        }
      })();
      return true;

    case MessageType.MODEL_STOP:
      sigmaEclipseClient
        .stopServer()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
          console.error('Model stop error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case MessageType.MODEL_STATUS:
      sigmaEclipseClient
        .getStatus()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
          console.error('Model status error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case MessageType.APP_STATUS:
      sigmaEclipseClient
        .getAppStatus()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
          console.error('App status error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case MessageType.APP_LAUNCH:
      sigmaEclipseClient
        .launchApp()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
          console.error('App launch error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case MessageType.DOWNLOAD_STATUS:
      sigmaEclipseClient
        .isDownloading()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
          console.error('Download status error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    case MessageType.HOST_STATUS:
      sigmaEclipseClient
        .checkHostAvailable()
        .then(data => sendResponse({ success: true, data }))
        .catch(error => {
          console.error('Host status error:', error);
          sendResponse({ success: false, error: error.message });
        });
      return true;

    default:
      sendResponse({ error: 'Unknown message type' });
      return false;
  }
});

// Handle extension installation
chrome.runtime.onInstalled.addListener(handleInstallation);

// Handle context menu click
chrome.contextMenus.onClicked.addListener(handleContextMenuClick);

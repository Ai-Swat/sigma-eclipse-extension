import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  PropsWithChildren,
} from 'react';
import { MessageType, PageContext as PageContextType } from '../../types';

interface PageContextState {
  pageContext: PageContextType | null;
  isAttached: boolean;
  isLoading: boolean;
}

interface PageContextContextType extends PageContextState {
  attachContext: () => void;
  detachContext: () => void;
  refreshContext: () => void;
}

const PageContextContext = createContext<PageContextContextType | undefined>(undefined);

export function PageContextProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<PageContextState>({
    pageContext: null,
    isAttached: false,
    isLoading: false,
  });

  // Get favicon URL from a page URL
  const getFaviconUrl = useCallback((url: string): string => {
    try {
      const urlObj = new URL(url);
      return `${urlObj.origin}/favicon.ico`;
    } catch {
      return '';
    }
  }, []);

  // Fetch current page context
  const fetchPageContext = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));

      // Get active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab || !tab.id || !tab.url) {
        console.warn('[PageContext] No active tab found');
        setState(prev => ({ ...prev, isLoading: false }));
        return;
      }

      // Skip chrome:// and chrome-extension:// pages
      if (tab.url.startsWith('chrome://') || tab.url.startsWith('chrome-extension://')) {
        console.warn('[PageContext] Cannot get context from chrome:// pages');
        setState(prev => ({
          ...prev,
          pageContext: null,
          isLoading: false,
        }));
        return;
      }

      let response: PageContextType | null = null;

      try {
        // Try to get page context from content script
        response = await chrome.tabs.sendMessage(tab.id, {
          type: MessageType.GET_PAGE_CONTEXT,
        });
      } catch (error: any) {
        console.warn('[PageContext] Content script not responding, trying to inject...');

        // Try to inject content script
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js'],
          });

          // Wait for initialization
          await new Promise(resolve => setTimeout(resolve, 300));

          // Try again
          response = await chrome.tabs.sendMessage(tab.id, {
            type: MessageType.GET_PAGE_CONTEXT,
          });
        } catch (injectError) {
          console.error('[PageContext] Failed to inject content script:', injectError);
        }
      }

      if (response) {
        const favicon = tab.favIconUrl || getFaviconUrl(response.url);
        setState(prev => ({
          ...prev,
          pageContext: { ...response, favicon },
          isLoading: false,
        }));
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error('[PageContext] Error fetching page context:', error);
      setState(prev => ({ ...prev, isLoading: false }));
    }
  }, [getFaviconUrl]);

  // Listen for tab changes
  useEffect(() => {
    // Initial fetch
    fetchPageContext();

    // Listen for tab activation (switching between tabs)
    const handleTabActivated = () => {
      console.log('[PageContext] Tab activated, fetching context...');
      fetchPageContext();
    };

    // Listen for tab updates (page navigation, title change, etc.)
    const handleTabUpdated = (tabId: number, changeInfo: chrome.tabs.TabChangeInfo) => {
      // Only fetch if the updated tab is the active one and status is complete
      if (changeInfo.status === 'complete') {
        chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
          if (activeTab && activeTab.id === tabId) {
            console.log('[PageContext] Active tab updated, fetching context...');
            fetchPageContext();
          }
        });
      }
    };

    chrome.tabs.onActivated.addListener(handleTabActivated);
    chrome.tabs.onUpdated.addListener(handleTabUpdated);

    return () => {
      chrome.tabs.onActivated.removeListener(handleTabActivated);
      chrome.tabs.onUpdated.removeListener(handleTabUpdated);
    };
  }, [fetchPageContext]);

  const attachContext = useCallback(() => {
    setState(prev => ({ ...prev, isAttached: true }));
  }, []);

  const detachContext = useCallback(() => {
    setState(prev => ({ ...prev, isAttached: false }));
  }, []);

  const refreshContext = useCallback(() => {
    fetchPageContext();
  }, [fetchPageContext]);

  return (
    <PageContextContext.Provider
      value={{
        ...state,
        attachContext,
        detachContext,
        refreshContext,
      }}
    >
      {children}
    </PageContextContext.Provider>
  );
}

export function usePageContext() {
  const context = useContext(PageContextContext);
  if (!context) {
    throw new Error('usePageContext must be used within PageContextProvider');
  }
  return context;
}

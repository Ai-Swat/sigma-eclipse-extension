import {
  createContext,
  useContext,
  useState,
  useCallback,
  PropsWithChildren,
  useEffect,
} from 'react';

export type ModelStatus = 'stopped' | 'running' | 'starting' | 'stopping' | 'error';
export type AppStatus = 'stopped' | 'running' | 'launching' | 'unknown';

interface ModelContextType {
  hostInstalled: boolean | null;
  modelStatus: ModelStatus;
  appStatus: AppStatus;
  isDownloading: boolean;
  downloadProgress: number | null;
  error: string | null;
  isLoading: boolean;
  startModel: () => Promise<void>;
  stopModel: () => Promise<void>;
  refreshStatus: () => Promise<void>;
  isModelReady: boolean;
}

const ModelContext = createContext<ModelContextType | undefined>(undefined);

export function ModelContextProvider({ children }: PropsWithChildren) {
  const [hostInstalled, setHostInstalled] = useState<boolean | null>(null);
  const [modelStatus, setModelStatus] = useState<ModelStatus>('stopped');
  const [appStatus, setAppStatus] = useState<AppStatus>('unknown');
  const [isDownloading, setIsDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isModelReady, setIsModelReady] = useState(true);

  const refreshHostStatus = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'HOST_STATUS',
      });

      if (response?.success && response.data) {
        setHostInstalled(response.data.available);
      } else if (response?.error) {
        console.warn('Host status check failed:', response.error);
        setHostInstalled(false);
      }
    } catch (err) {
      console.warn('Failed to get host status:', err);
      setHostInstalled(false);
    }
  }, []);

  const refreshAppStatus = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'APP_STATUS',
      });

      if (response?.success && response.data) {
        setAppStatus(response.data.is_running ? 'running' : 'stopped');
      } else if (response?.error) {
        console.warn('App status check failed:', response.error);
        setAppStatus('unknown');
      }
    } catch (err) {
      console.warn('Failed to get app status:', err);
      setAppStatus('unknown');
    }
  }, []);

  const refreshModelStatus = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'MODEL_STATUS',
      });

      if (response?.success && response.data) {
        setModelStatus(response.data.is_running ? 'running' : 'stopped');
        setError(null);
      } else if (response?.error) {
        console.warn('Model status check failed:', response.error);
      }
    } catch (err) {
      console.warn('Failed to get model status:', err);
    }
  }, []);

  const refreshDownloadStatus = useCallback(async () => {
    try {
      const response = await chrome.runtime.sendMessage({
        type: 'DOWNLOAD_STATUS',
      });

      if (response?.success && response.data) {
        setIsDownloading(response.data.is_downloading);
        setDownloadProgress(response.data.progress);
      } else if (response?.error) {
        console.warn('Download status check failed:', response.error);
      }
    } catch (err) {
      console.warn('Failed to get download status:', err);
    }
  }, []);

  const refreshStatus = useCallback(async () => {
    await refreshHostStatus();
    // Only check other statuses if host is available
    if (hostInstalled !== false) {
      await Promise.all([refreshAppStatus(), refreshModelStatus(), refreshDownloadStatus()]);
    }
  }, [
    refreshHostStatus,
    refreshAppStatus,
    refreshModelStatus,
    refreshDownloadStatus,
    hostInstalled,
  ]);

  // Check status on mount
  useEffect(() => {
    refreshHostStatus();
  }, [refreshHostStatus]);

  // Check other statuses when host becomes available
  useEffect(() => {
    if (hostInstalled === true) {
      Promise.all([refreshAppStatus(), refreshModelStatus(), refreshDownloadStatus()]);
    }
  }, [hostInstalled, refreshAppStatus, refreshModelStatus, refreshDownloadStatus]);

  // Listen for status updates from background
  useEffect(() => {
    const handleMessage = (message: {
      type: string;
      data?: {
        hostAvailable?: boolean;
        appRunning: boolean;
        modelRunning: boolean;
        isDownloading: boolean;
        downloadProgress: number | null;
      };
    }) => {
      if (message.type === 'STATUS_UPDATE' && message.data) {
        // Update host status
        if (message.data.hostAvailable !== undefined) {
          setHostInstalled(message.data.hostAvailable);
        }

        // Only update other statuses if host is available
        if (message.data.hostAvailable !== false) {
          // Update download status
          setIsDownloading(message.data.isDownloading);
          setDownloadProgress(message.data.downloadProgress);

          // Only update if not in a transitional state (starting/stopping/launching)
          if (appStatus !== 'launching') {
            setAppStatus(message.data.appRunning ? 'running' : 'stopped');
          }
          if (modelStatus !== 'starting' && modelStatus !== 'stopping') {
            setModelStatus(message.data.modelRunning ? 'running' : 'stopped');
          }
        }
      }
    };

    chrome.runtime.onMessage.addListener(handleMessage);
    return () => chrome.runtime.onMessage.removeListener(handleMessage);
  }, [appStatus, modelStatus]);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (modelStatus !== 'running') {
      setIsModelReady(false);
    }

    if (modelStatus === 'running') {
      timer = setTimeout(() => {
        setIsModelReady(true);
      }, 4000);
    }

    return () => clearTimeout(timer);
  }, [modelStatus]);

  const startModel = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    // If app is not running, show launching status
    if (appStatus !== 'running') {
      setAppStatus('launching');
    }
    setModelStatus('starting');

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'MODEL_START',
      });

      if (response?.success) {
        setModelStatus('running');
        setAppStatus('running');
      } else {
        setModelStatus('error');
        setError(response?.error || 'Failed to start model');
        // Refresh to get actual statuses
        await refreshStatus();
      }
    } catch (err) {
      setModelStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to start model');
      await refreshStatus();
    } finally {
      setIsLoading(false);
    }
  }, [appStatus, refreshStatus]);

  const stopModel = useCallback(async () => {
    setIsLoading(true);
    setModelStatus('stopping');
    setError(null);

    try {
      const response = await chrome.runtime.sendMessage({
        type: 'MODEL_STOP',
      });

      if (response?.success) {
        setModelStatus('stopped');
      } else {
        setModelStatus('error');
        setError(response?.error || 'Failed to stop model');
      }
    } catch (err) {
      setModelStatus('error');
      setError(err instanceof Error ? err.message : 'Failed to stop model');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const value: ModelContextType = {
    hostInstalled,
    modelStatus,
    appStatus,
    isDownloading,
    downloadProgress,
    error,
    isLoading,
    startModel,
    stopModel,
    refreshStatus,
    isModelReady,
  };

  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
}

export function useModelContext() {
  const context = useContext(ModelContext);
  if (!context) {
    throw new Error('useModelContext must be used within ModelContextProvider');
  }
  return context;
}

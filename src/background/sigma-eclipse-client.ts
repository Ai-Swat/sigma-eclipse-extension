// SigmaEclipseClient - Native Messaging client for Sigma Eclipse LLM
// Manages communication with the native host for model control

const HOST_NAME = 'com.sigma_eclipse.host';

export interface ServerStatus {
  is_running: boolean;
  pid?: number;
  port?: number;
  message: string;
}

export interface StartServerResponse {
  message: string;
  pid: number;
  port: number;
}

export interface StopServerResponse {
  message: string;
}

export interface DownloadStatus {
  is_downloading: boolean;
  progress: number | null;
}

export interface AppStatus {
  is_running: boolean;
  message?: string;
}

export interface LaunchAppResponse {
  message: string;
}

type PendingResolver<T> = {
  resolve: (value: T) => void;
  reject: (error: Error) => void;
};

class SigmaEclipseClient {
  private port: chrome.runtime.Port | null = null;
  private messageId = 0;
  private pending = new Map<string, PendingResolver<unknown>>();
  private _hostAvailable: boolean | null = null;
  private _lastHostError: string | null = null;

  get hostAvailable(): boolean | null {
    return this._hostAvailable;
  }

  get lastHostError(): string | null {
    return this._lastHostError;
  }

  connect(): void {
    if (this.port) {
      return;
    }

    console.log('[SigmaEclipseClient] Connecting to native host:', HOST_NAME, 'at', new Date().toISOString());

    try {
      this.port = chrome.runtime.connectNative(HOST_NAME);
    } catch (err) {
      console.error('[SigmaEclipseClient] Failed to connect:', err);
      this._hostAvailable = false;
      this._lastHostError = err instanceof Error ? err.message : 'Failed to connect';
      return;
    }

    this.port.onMessage.addListener(
      (message: { id: string; success: boolean; data: unknown; error?: string }) => {
        console.log('[SigmaEclipseClient] Received from host:', message);

        // Successfully received message means host is available
        this._hostAvailable = true;
        this._lastHostError = null;

        const resolver = this.pending.get(message.id);
        if (resolver) {
          this.pending.delete(message.id);
          if (message.success) {
            resolver.resolve(message.data);
          } else {
            resolver.reject(new Error(message.error || 'Unknown error'));
          }
        }
      }
    );

    this.port.onDisconnect.addListener(() => {
      console.log('[SigmaEclipseClient] Disconnected from native host');
      const error = chrome.runtime.lastError?.message || 'Disconnected';

      // Check if host is not installed
      if (
        error.includes('not found') ||
        error.includes('Specified native messaging host not found')
      ) {
        this._hostAvailable = false;
        this._lastHostError = 'Native messaging host not found. Please install Sigma Eclipse app.';
      } else {
        this._lastHostError = error;
      }

      console.error('[SigmaEclipseClient] Disconnect error:', error);

      // Reject all pending requests
      for (const [id, resolver] of this.pending) {
        resolver.reject(new Error(error));
        this.pending.delete(id);
      }

      this.port = null;
    });

    console.log('[SigmaEclipseClient] Connected to native host');
  }

  /**
   * Check if native messaging host is available
   */
  async checkHostAvailable(): Promise<{ available: boolean; error: string | null }> {
    try {
      // Try to connect and send a simple command
      await this.getAppStatus();
      this._hostAvailable = true;
      this._lastHostError = null;
      return { available: true, error: null };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';

      // Check for specific "not found" errors
      if (
        errorMessage.includes('not found') ||
        errorMessage.includes('Specified native messaging host not found') ||
        errorMessage.includes('Failed to connect')
      ) {
        this._hostAvailable = false;
        this._lastHostError = 'Native messaging host not found. Please install Sigma Eclipse app.';
      } else {
        // Other errors might be temporary
        this._lastHostError = errorMessage;
      }

      return { available: this._hostAvailable ?? false, error: this._lastHostError };
    }
  }

  disconnect(): void {
    if (this.port) {
      this.port.disconnect();
      this.port = null;
    }
  }

  private async sendCommand<T>(command: string, params: Record<string, unknown> = {}): Promise<T> {
    if (!this.port) {
      this.connect();
    }

    if (!this.port) {
      throw new Error('Failed to connect to native host');
    }

    const id = String(++this.messageId);
    const message = { id, command, params };

    return new Promise<T>((resolve, reject) => {
      this.pending.set(id, {
        resolve: resolve as (value: unknown) => void,
        reject,
      });

      console.log('[SigmaEclipseClient] Sending to host:', message);
      this.port!.postMessage(message);

      // Timeout after 30 seconds
      setTimeout(() => {
        if (this.pending.has(id)) {
          this.pending.delete(id);
          reject(new Error('Request timeout'));
        }
      }, 30000);
    });
  }

  async startServer(): Promise<StartServerResponse> {
    return this.sendCommand<StartServerResponse>('start_server');
  }

  async stopServer(): Promise<StopServerResponse> {
    return this.sendCommand<StopServerResponse>('stop_server');
  }

  async getStatus(): Promise<ServerStatus> {
    return this.sendCommand<ServerStatus>('get_server_status');
  }

  async isDownloading(): Promise<DownloadStatus> {
    return this.sendCommand<DownloadStatus>('isDownloading');
  }

  async getAppStatus(): Promise<AppStatus> {
    return this.sendCommand<AppStatus>('get_app_status');
  }

  async launchApp(): Promise<LaunchAppResponse> {
    return this.sendCommand<LaunchAppResponse>('launch_app');
  }

  /**
   * Ensures the app is running, launching it if necessary.
   * Waits for the app to be ready before resolving.
   */
  async ensureAppRunning(maxWaitMs: number = 30000, pollIntervalMs: number = 1000): Promise<void> {
    const appStatus = await this.getAppStatus();

    if (appStatus.is_running) {
      console.log('[SigmaEclipseClient] App already running');
      return;
    }

    console.log('[SigmaEclipseClient] App not running, launching...');
    await this.launchApp();

    // Wait for app to start
    const startTime = Date.now();
    while (Date.now() - startTime < maxWaitMs) {
      await new Promise(resolve => setTimeout(resolve, pollIntervalMs));

      try {
        const status = await this.getAppStatus();
        if (status.is_running) {
          console.log('[SigmaEclipseClient] App is now running');
          return;
        }
      } catch (err) {
        console.warn('[SigmaEclipseClient] Error checking app status:', err);
      }
    }

    throw new Error('Timeout waiting for app to start');
  }
}

// Singleton instance
export const sigmaEclipseClient = new SigmaEclipseClient();

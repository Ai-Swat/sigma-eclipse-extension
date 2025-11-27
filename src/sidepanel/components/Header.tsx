import HistoryIcon from 'src/images/history-icon-extension.svg?react';
import PlusIcon from 'src/images/plus.svg?react';
import { BaseButton } from '@/sidepanel/components/ui';
import { TooltipDefault } from '@/components/ui/tooltip';
import { useModelContext, ModelStatus, AppStatus } from '@/sidepanel/contexts/modelContext';
import styles from './Header.module.css';

interface HeaderProps {
  onNewThread: () => void;
  onHistory: () => void;
}

function getAppStatusText(status: AppStatus): string {
  switch (status) {
    case 'running':
      return 'App';
    case 'stopped':
      return 'App Offline';
    case 'launching':
      return 'Launching App...';
    case 'unknown':
      return 'App Unknown';
    default:
      return 'App';
  }
}

function getAppStatusColor(status: AppStatus): string {
  switch (status) {
    case 'running':
      return 'var(--text-success-primary, #22c55e)';
    case 'stopped':
      return 'var(--text-neutral-tertiary)';
    case 'launching':
      return 'var(--text-warning-primary, #f59e0b)';
    case 'unknown':
      return 'var(--text-neutral-tertiary)';
    default:
      return 'var(--text-neutral-tertiary)';
  }
}

function getModelStatusText(status: ModelStatus, isDownloading: boolean, downloadProgress: number | null): string {
  if (isDownloading) {
    if (downloadProgress !== null) {
      return `Downloading ${Math.round(downloadProgress)}%`;
    }
    return 'Downloading...';
  }
  
  switch (status) {
    case 'running':
      return 'LLM Running';
    case 'stopped':
      return 'LLM Stopped';
    case 'starting':
      return 'Starting LLM...';
    case 'stopping':
      return 'Stopping LLM...';
    case 'error':
      return 'LLM Error';
    default:
      return 'Unknown';
  }
}

function getModelStatusColor(status: ModelStatus, isDownloading: boolean): string {
  if (isDownloading) {
    return 'var(--text-info-primary, #3b82f6)';
  }
  
  switch (status) {
    case 'running':
      return 'var(--text-success-primary, #22c55e)';
    case 'stopped':
      return 'var(--text-neutral-tertiary)';
    case 'starting':
    case 'stopping':
      return 'var(--text-warning-primary, #f59e0b)';
    case 'error':
      return 'var(--text-error-primary, #ef4444)';
    default:
      return 'var(--text-neutral-tertiary)';
  }
}

export default function Header({ onNewThread, onHistory }: HeaderProps) {
  const { modelStatus, appStatus, isDownloading, downloadProgress, isLoading, startModel, stopModel } = useModelContext();

  const handleModelToggle = () => {
    if (modelStatus === 'running') {
      stopModel();
    } else if (modelStatus === 'stopped' || modelStatus === 'error') {
      startModel();
    }
  };

  // Disable button when downloading, loading, or in transitional states
  const isButtonDisabled = isDownloading || isLoading || modelStatus === 'starting' || modelStatus === 'stopping' || appStatus === 'launching';
  const buttonText = modelStatus === 'running' ? 'Stop' : 'Start';
  const buttonColor = modelStatus === 'running' ? 'red' : 'grey';

  // ----------------- Render -----------------
  return (
    <div className={styles.headerStyles}>
      <header className={styles.headerInner}>
        {/* App & Model Status and Control */}
        <div className={styles.modelControl}>
          {/* App Status Indicator */}
          <div className={styles.statusIndicator}>
            <span
              className={styles.statusDot}
              style={{ backgroundColor: getAppStatusColor(appStatus) }}
            />
            <span className={styles.statusText}>{getAppStatusText(appStatus)}</span>
          </div>

          {/* Separator */}
          <span className={styles.statusSeparator}>•</span>

          {/* Model Status Indicator */}
          <div className={styles.statusIndicator}>
            <span
              className={`${styles.statusDot} ${isDownloading ? styles.downloading : ''}`}
              style={{ backgroundColor: getModelStatusColor(modelStatus, isDownloading) }}
            />
            <span className={styles.statusText}>
              {getModelStatusText(modelStatus, isDownloading, downloadProgress)}
            </span>
          </div>

          <TooltipDefault text={isDownloading ? 'Model is downloading...' : (modelStatus === 'running' ? 'Stop LLM' : 'Start LLM')}>
            <div className="relative">
              <BaseButton
                color={buttonColor}
                size={'xs'}
                onClick={handleModelToggle}
                disabled={isButtonDisabled}
                className={styles.modelButton}
              >
                {buttonText}
              </BaseButton>
            </div>
          </TooltipDefault>
        </div>

        {/* Spacer */}
        <div className={styles.spacer} />

        {/* Right side buttons */}
        <TooltipDefault text="New Thread">
          <div className="relative">
            <BaseButton color={'transparent'} size={'sm'} onClick={onNewThread}>
              <PlusIcon width={18} height={18} />
            </BaseButton>
          </div>
        </TooltipDefault>
        <TooltipDefault text="Open history">
          <div className="relative">
            <BaseButton color={'transparent'} size={'sm'} onClick={onHistory}>
              <HistoryIcon width={18} height={18} />
            </BaseButton>
          </div>
        </TooltipDefault>
      </header>
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from 'react';
import { clsx } from 'clsx';
import useClickOutside from '@/libs/use/use-click-outside.ts';
import { ModelStatus, useModelContext } from '@/sidepanel/contexts/modelContext.tsx';

import { CheckboxToggle } from '@/components/ui/checkbox-toggle';
import ArrowIcon from '@/images/arrow-down-01-sharp.svg?react';
import DotIcon from '@/images/dot.svg?react';
import { Loader } from '@/components/ui/loader';

import styles from './styles.module.css';

function getModelStatusText(
  status: ModelStatus,
  isDownloading: boolean,
  downloadProgress: number | null
): string {
  if (isDownloading) {
    if (downloadProgress !== null) {
      return `Downloading ${Math.round(downloadProgress)}%`;
    }
    return 'Downloading...';
  }

  switch (status) {
    case 'running':
      return 'Running';
    case 'stopped':
    case 'stopping':
      return 'Stopped';
    case 'starting':
      return 'Starting';
    case 'error':
      return 'Error';
    default:
      return 'Unknown';
  }
}

function getModelStatusColor(status: ModelStatus, isDownloading: boolean): string {
  if (isDownloading) {
    return 'var(--text-neutral-tertiary)';
  }

  switch (status) {
    case 'running':
    case 'starting':
      return 'var(--text-colored-success)';
    case 'stopped':
    case 'stopping':
      return 'var(--text-neutral-tertiary)';
    case 'error':
      return 'var(--text-error-primary)';
    default:
      return 'var(--text-neutral-tertiary)';
  }
}

export default function SigmaEclipseLLM() {
  const {
    modelStatus,
    appStatus,
    isDownloading,
    downloadProgress,
    isLoading,
    isModelReady,
    startModel,
    stopModel,
  } = useModelContext();

  const handleModelToggle = () => {
    if (modelStatus === 'running') {
      void stopModel();
    } else if (modelStatus === 'stopped' || modelStatus === 'error') {
      void startModel();
    }
  };

  const [open, setOpen] = useState(false);
  const [isLoadingModelReady, setIsLoadingModelReady] = useState(false);
  const enabled = modelStatus === 'running';
  const status = getModelStatusText(modelStatus, isDownloading, downloadProgress);
  const color = getModelStatusColor(modelStatus, isDownloading);

  // Disable button when downloading, loading, or in transitional states
  const isButtonDisabled =
    isDownloading ||
    isLoading ||
    isLoadingModelReady ||
    modelStatus === 'starting' ||
    modelStatus === 'stopping' ||
    appStatus === 'launching';

  const closeDropdown = useCallback(() => setOpen(false), []);
  const ref = useRef<HTMLDivElement | null>(null);
  useClickOutside(ref, closeDropdown);

  useEffect(() => {
    if (modelStatus === 'running' && isModelReady) {
      setIsLoadingModelReady(false);
    }
    if (modelStatus === 'running' && !isModelReady) {
      setIsLoadingModelReady(true);
    }
  }, [isModelReady, modelStatus, setIsLoadingModelReady]);

  return (
    <div className={styles.wrapper} ref={ref}>
      <button onClick={() => setOpen(!open)} className={styles.header} style={{ color: color }}>
        {isDownloading && <Loader strokeWidth={11} size={14} color={'white'} />}
        {!isDownloading && <DotIcon />}

        <span className={styles.title}>Sigma Eclipse LLM</span>

        <ArrowIcon
          className={clsx(styles.iconArrow, {
            [styles.iconRotate]: open,
          })}
        />
      </button>

      {open && (
        <div className={clsx(styles.card, 'fade-in')}>
          <div className={styles.topRow}>
            <span className={styles.cardTitle}>Sigma Eclipse LLM</span>

            <CheckboxToggle
              disabled={isButtonDisabled}
              onChange={handleModelToggle}
              checked={enabled}
            />
          </div>

          <div className={styles.divider} />

          <div className={styles.statusBlock}>
            <span className={styles.statusLabel}>Status</span>

            <div className={styles.statusRow} style={{ color: color }}>
              {isDownloading && <Loader strokeWidth={11} size={14} />}
              {isLoadingModelReady && <Loader strokeWidth={11} size={14} color="green" />}
              {!isDownloading && !isLoadingModelReady && <DotIcon />}

              <span className={styles.statusText}>{isLoadingModelReady ? 'Starting' : status}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

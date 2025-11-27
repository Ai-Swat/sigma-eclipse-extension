import { useModelContext } from '@/sidepanel/contexts/modelContext';
import styles from './InstallAppPrompt.module.css';

const DOWNLOAD_URL = 'https://github.com/user/sigma-eclipse/releases'; // TODO: Update with actual URL

export default function InstallAppPrompt() {
  const { hostInstalled, refreshStatus } = useModelContext();

  // Don't show if host is installed or status is unknown
  if (hostInstalled !== false) {
    return null;
  }

  const handleDownload = () => {
    window.open(DOWNLOAD_URL, '_blank');
  };

  const handleRetry = () => {
    refreshStatus();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path 
              d="M12 2L2 7L12 12L22 7L12 2Z" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 17L12 22L22 17" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
            <path 
              d="M2 12L12 17L22 12" 
              stroke="currentColor" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            />
          </svg>
        </div>
        
        <h2 className={styles.title}>Sigma Eclipse Required</h2>
        
        <p className={styles.description}>
          To use the local LLM features, you need to install the Sigma Eclipse desktop application. 
          This app manages the AI model and runs locally on your computer.
        </p>
        
        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔒</span>
            <span>100% Private - runs locally</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>⚡</span>
            <span>Fast inference with GPU support</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🌐</span>
            <span>No internet required after setup</span>
          </div>
        </div>
        
        <div className={styles.actions}>
          <button className={styles.downloadButton} onClick={handleDownload}>
            Download Sigma Eclipse
          </button>
          <button className={styles.retryButton} onClick={handleRetry}>
            I've installed it - Retry
          </button>
        </div>
        
        <p className={styles.hint}>
          After installing, make sure to run the app at least once to complete setup.
        </p>
      </div>
    </div>
  );
}


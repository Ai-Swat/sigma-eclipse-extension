import { useModelContext } from '@/sidepanel/contexts/modelContext';
import { BaseButton } from '@/sidepanel/components/ui';
import ImageLogo from '@/images/logo2.png';
import styles from './InstallAppPrompt.module.css';

// TODO: Update with actual URL
const DOWNLOAD_URL = 'https://github.com/user/sigma-eclipse/releases';

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
    void refreshStatus();
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.icon}>
          <img alt="Sigma Eclipse Logo" width={72} height={72} src={ImageLogo} />
        </div>

        <h2 className={styles.title}>Sigma Eclipse Required</h2>

        <p className={styles.description}>
          To use the local LLM features, you need to install the Sigma Eclipse desktop application.
          <br />
          This app manages the AI model and runs locally on your computer.
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>🔒</span>
            <span>100% Private – runs locally</span>
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
          <BaseButton className={styles.button} size="lg" color="gradient" onClick={handleDownload}>
            Download Sigma Eclipse
          </BaseButton>
          <BaseButton className={styles.button} size="lg" color="transparent" onClick={handleRetry}>
            I&#39;ve installed it – Retry
          </BaseButton>
        </div>

        <p className={styles.hint}>
          After installing, make sure to run the app at least once to complete setup.
        </p>
      </div>
    </div>
  );
}

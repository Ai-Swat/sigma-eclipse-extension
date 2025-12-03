import { useModelContext } from '@/sidepanel/contexts/modelContext';
import { BaseButton } from '@/sidepanel/components/ui';
import ImageLogo from '@/images/logo-sigma-eclipse.png';
import MonitorIcon from '@/images/monitor-03.svg?react';
import WifiIcon from '@/images/wifi-off.svg?react';
import GiftIcon from '@/images/gift-01.svg?react';
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

        <h2 className={styles.title}>Sigma Eclipse LLM Required</h2>

        <p className={styles.description}>
          Chase the full power of AI
          <br />
          on your computer absolutely free
        </p>

        <div className={styles.features}>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <WifiIcon width={18} height={18} />
            </span>
            <span>Zero Data Transfer</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <MonitorIcon width={18} height={18} />
            </span>
            <span>Cloudless computing</span>
          </div>
          <div className={styles.feature}>
            <span className={styles.featureIcon}>
              <GiftIcon width={18} height={18} />
            </span>
            <span>Totally free</span>
          </div>
        </div>

        <div className={styles.actions}>
          <BaseButton className={styles.button} size="lg" color="primary" onClick={handleDownload}>
            Download Sigma Eclipse LLM
          </BaseButton>
          <BaseButton className={styles.button} size="lg" color="transparent" onClick={handleRetry}>
            I&#39;ve installed it – Retry
          </BaseButton>
        </div>

        <p className={styles.hint}>
          After installing, make sure to run the app
          <br />
          to complete setup.
        </p>
      </div>
    </div>
  );
}

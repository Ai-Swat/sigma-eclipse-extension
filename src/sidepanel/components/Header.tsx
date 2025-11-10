import HistoryIcon from 'src/images/history-icon-extension.svg?react';
import PlusIcon from 'src/images/plus.svg?react';
import styles from './Header.module.css';

interface HeaderProps {
  onNewThread: () => void;
  onHistory: () => void;
}

export default function Header({
  onNewThread,
  onHistory,
}: HeaderProps) {
  // ----------------- Render -----------------
  return (
    <div className={styles.headerStyles}>
      <header className={styles.headerInner}>
        <h1 className={styles.title}>
          <span className={styles.titleText}>Sigma Private</span>
        </h1>
        
        <div className={styles.actions}>
          <button
            className={styles.iconButton}
            title="New Thread"
            onClick={onNewThread}
            aria-label="New Thread"
          >
            <PlusIcon width={18} height={18} />
          </button>
          
          <button
            className={styles.iconButton}
            title="History"
            onClick={onHistory}
            aria-label="History"
          >
            <HistoryIcon width={18} height={18} />
          </button>
        </div>
      </header>
    </div>
  );
}


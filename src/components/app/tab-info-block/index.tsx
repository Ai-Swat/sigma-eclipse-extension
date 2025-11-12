import { memo } from 'react';
import { clsx } from 'clsx';
import { usePageContext } from '@/sidepanel/contexts/pageContext.tsx';
import { TabInfoRow } from './components/tab-info-row';
import PlusIcon from 'src/images/plus.svg?react';
import styles from './styles.module.css';

function TabInfoHeaderComponent() {
  const { pageContext, isAttached, isLoading, favicon, attachContext, detachContext } =
    usePageContext();

  // Don't show indicator if no page context available
  if (!pageContext) {
    return null;
  }

  // Skip chrome:// and extension pages
  if (
    pageContext.url.startsWith('chrome://') ||
    pageContext.url.startsWith('chrome-extension://')
  ) {
    return null;
  }

  const handleToggleAttach = () => {
    if (isAttached) {
      detachContext();
    } else {
      attachContext();
    }
  };

  return (
    <div className={clsx(styles.wrapper, 'opacity-animation')} onClick={handleToggleAttach}>
      {pageContext && favicon && <TabInfoRow favicon={favicon} title={pageContext?.title} />}

      <button className={styles.button} disabled={isLoading}>
        {isAttached ? (
          <span>Remove from Context</span>
        ) : (
          <>
            <span>Add to Context</span>
            <PlusIcon className={styles.icon} />
          </>
        )}
      </button>
    </div>
  );
}

export const TabInfoHeader = memo(TabInfoHeaderComponent);

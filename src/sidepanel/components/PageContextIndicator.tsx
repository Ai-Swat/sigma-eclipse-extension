import React from 'react';
import { usePageContext } from '../contexts/pageContext';
import styles from './PageContextIndicator.module.css';

const PageContextIndicator: React.FC = () => {
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
    <div className={styles.container}>
      <div className={styles.pageInfo}>
        <div className={styles.favicon}>
          {favicon ? (
            <img
              src={favicon}
              alt=""
              className={styles.faviconImg}
              onError={e => {
                // Hide favicon on error
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <div className={styles.faviconPlaceholder}>🌐</div>
          )}
        </div>
        <div className={styles.pageDetails}>
          <div className={styles.pageTitle} title={pageContext.title}>
            {pageContext.title || 'Untitled'}
          </div>
          <div className={styles.pageUrl} title={pageContext.url}>
            {new URL(pageContext.url).hostname}
          </div>
        </div>
      </div>

      <button
        className={`${styles.attachButton} ${isAttached ? styles.attached : ''}`}
        onClick={handleToggleAttach}
        disabled={isLoading}
        title={isAttached ? 'Detach from context' : 'Attach to context'}
      >
        {isAttached ? (
          <>
            <span className={styles.attachIcon}>📎</span>
            <span className={styles.attachText}>Attached</span>
          </>
        ) : (
          <>
            <span className={styles.attachIcon}>📎</span>
            <span className={styles.attachText}>Attach</span>
          </>
        )}
      </button>
    </div>
  );
};

export default PageContextIndicator;

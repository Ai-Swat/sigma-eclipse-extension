import { memo } from 'react';
import cn from 'clsx';
import styles from './styles.module.css';

function TabInfoRowComponent({
  favicon,
  title,
  className,
}: {
  favicon?: string;
  title: string;
  className?: string;
}) {
  return (
    <div className={cn(styles.wrapperRow, className)}>
      {favicon && <img src={favicon} alt="favicon" className="favicon-styles" />}
      <span className={styles.title}>{title}</span>
    </div>
  );
}

export const TabInfoRow = memo(TabInfoRowComponent);

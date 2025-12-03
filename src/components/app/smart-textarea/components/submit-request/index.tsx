import { useEffect } from 'react';
import cn from 'clsx';
import { BaseButton } from '@/sidepanel/components/ui';
import { useModelContext } from '@/sidepanel/contexts/modelContext.tsx';
import styles from './styles.module.css';

export function SubmitRequest({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
}) {
  const { modelStatus, startModel } = useModelContext();

  const handleStart = () => {
    void startModel();
    setIsOpen(false);
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (modelStatus === 'running') {
      setIsOpen(false);
    }
  }, [modelStatus, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div className={cn(styles.wrapper, 'fade-in')}>
      <div className={styles.text}>
        <div>It seems the Sigma Eclipse App isn’t running.</div>
        <div>Should I start it for you?</div>
      </div>
      <div className={styles.buttons}>
        <BaseButton onClick={handleStart} color="black" className={styles.button}>
          Submit
        </BaseButton>
        <BaseButton onClick={handleCancel} color="grey" className={styles.button}>
          Cancel
        </BaseButton>
      </div>
    </div>
  );
}

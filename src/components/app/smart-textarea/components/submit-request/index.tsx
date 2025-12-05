import { useEffect, useState } from 'react';
import cn from 'clsx';
import { BaseButton, Loader } from '@/sidepanel/components/ui';
import { useModelContext } from '@/sidepanel/contexts/modelContext.tsx';
import styles from './styles.module.css';

export function SubmitRequest({
  isOpen,
  setIsOpen,
}: {
  isOpen: boolean;
  setIsOpen: (status: boolean) => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const { modelStatus, isModelReady, startModel } = useModelContext();

  const handleStart = () => {
    void startModel();
  };

  const handleCancel = () => {
    setIsOpen(false);
  };

  useEffect(() => {
    if (isOpen) {
      setIsLoading(false);
    }
  }, [isOpen]);

  useEffect(() => {
    if (modelStatus === 'running' && isModelReady) {
      setIsOpen(false);
      setIsLoading(false);
    }
    if (modelStatus === 'running' && !isModelReady) {
      setIsLoading(true);
    }
  }, [isModelReady, setIsOpen, modelStatus, setIsLoading]);

  if (!isOpen) return null;

  return (
    <div className={cn(styles.wrapper, 'fade-in')}>
      <div className={styles.text}>
        <div>It seems the Sigma Eclipse LLM App isn’t running.</div>
        <div>Should I start it for you?</div>
      </div>
      <div className={styles.buttons}>
        <BaseButton onClick={handleStart} color="black" className={styles.button}>
          {isLoading ? <Loader color="black" size={20} /> : 'Submit'}
        </BaseButton>
        <BaseButton onClick={handleCancel} color="grey" className={styles.button}>
          Cancel
        </BaseButton>
      </div>
    </div>
  );
}

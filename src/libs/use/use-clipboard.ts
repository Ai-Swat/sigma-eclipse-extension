import { useCallback, useState } from 'react';
import { copyToClipboard } from '../clipboard.ts';

const DELAY = 3000;

export function useClipboard() {
  const [status, setStatus] = useState(false);

  const copyToBuffer = useCallback((str: string) => {
    copyToClipboard(str, success => {
      setStatus(success);
      if (success) {
        setTimeout(() => setStatus(false), DELAY);
      }
    });
  }, []);

  return [copyToBuffer, status] as const;
}

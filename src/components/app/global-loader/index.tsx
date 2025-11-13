import { useEffect, useRef } from 'react';
import lottie from 'lottie-web-light';
import Animation from './bagoodex-global-loader.json';
import styles from './styles.module.css';
import cn from 'clsx';

export function GlobalLoader({ text }: { text?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const animation = lottie.loadAnimation({
      container: containerRef.current,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      animationData: Animation,
    });

    return () => animation.destroy();
  }, []);

  return (
    <div className={cn(styles.wrapper, 'opacity-animation')}>
      <div ref={containerRef} className={styles.animatedDot} style={{ width: 42, height: 42 }} />

      <div>{text || 'Thinking...'}</div>
    </div>
  );
}

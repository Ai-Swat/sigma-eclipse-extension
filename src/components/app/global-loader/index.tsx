import Lottie from 'lottie-react';
import Animation from './bagoodex-global-loader.json';
import styles from './styles.module.css';
import cn from 'clsx';

export function GlobalLoader({ text }: { text?: string }) {
  return (
    <div className={cn(styles.wrapper, 'opacity-animation')}>
      <Lottie
        animationData={Animation}
        loop={true}
        className={styles.animatedDot}
        style={{ width: 42, height: 42 }}
      />

      <div>{text || 'Thinking...'}</div>
    </div>
  );
}

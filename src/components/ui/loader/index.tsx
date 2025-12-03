import { PropsWithChildren, useId } from 'react';
import cn from 'clsx';
import styles from './styles.module.css';

type ComponentProps = {
  size?: number;
  className?: string;
  visible?: boolean;
  withBg?: boolean;
  strokeWidth?: number;
  color?: 'green' | 'white' | 'primary' | 'black';
};

export function Loader({
  visible,
  className,
  withBg,
  size = 26,
  strokeWidth = 7,
  color = 'primary',
}: PropsWithChildren & ComponentProps) {
  const id = useId();

  if (visible === false) {
    return null;
  }

  const cs = cn(styles.wrapper, className, color && styles[color]);

  return (
    <div style={{ width: size, height: size }} className={cs}>
      {withBg && <div className={cn(styles.bg, color && styles[color])} />}

      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid">
        <defs>
          {/* gradient tail */}
          <linearGradient
            id={`loaderGradient-${color}${id}`}
            x1="50%"
            y1="0%"
            x2="50%"
            y2="100%"
            gradientUnits="userSpaceOnUse"
            gradientTransform="rotate(90 50 50)"
          >
            <stop offset="0%" stopColor={'currentColor'} stopOpacity="0" />
            <stop offset="100%" stopColor={'currentColor'} stopOpacity="1" />
          </linearGradient>
        </defs>

        <g>
          {/* background */}
          <circle
            strokeDasharray="0"
            r="40"
            strokeWidth={strokeWidth.toString()}
            stroke=""
            fill="none"
            cy="50"
            cx="50"
            className={withBg ? styles.bgStroke : styles.bgStrokeTransparent}
          />

          {/* spinning tail */}
          <circle
            strokeDasharray="200"
            r="40"
            strokeWidth={strokeWidth.toString()}
            stroke={`url(#loaderGradient-${color}${id})`}
            strokeLinecap="round"
            fill="none"
            cy="50"
            cx="50"
          >
            <animateTransform
              keyTimes="0;1"
              values="0 50 50;360 50 50"
              dur="0.8333333333333334s"
              repeatCount="indefinite"
              type="rotate"
              attributeName="transform"
            />
          </circle>

          <g />
        </g>
      </svg>
    </div>
  );
}

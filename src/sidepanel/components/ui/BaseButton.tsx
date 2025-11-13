import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './BaseButton.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'primary' | 'transparent';
  size?: 'default' | 'sm' | 'xs';
  label?: string;
  onClick?: () => void;
  isActive?: boolean;
}

export default function BaseButton({
  children,
  color = 'primary',
  className,
  size = 'default',
  onClick,
                                     isActive,
  label,
  ...otherProps
}: ButtonProps) {
  const cn = clsx(styles.button, styles[color], styles[size], className, {
    [styles.isActive] : isActive
  });

  return (
    <button
      className={cn}
      onClick={onClick}
      {...otherProps}
      role="button"
      aria-label={label}
      type="button"
    >
      {children}
    </button>
  );
}

function Icon({ children, className }: { children: React.ReactNode; className?: string }) {
  const cn = clsx(styles.icon, className);

  return <div className={cn}>{children}</div>;
}

BaseButton.Icon = Icon;

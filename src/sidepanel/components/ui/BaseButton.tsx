import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from './BaseButton.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?: 'primary';
  size?: 'default';
  label?: string;
}

export default function BaseButton({
  children,
  color = 'primary',
  className,
  size = 'default',
  label,
  ...otherProps
}: ButtonProps) {
  const cn = clsx(styles.button, styles[color], styles[size], className);

  return (
    <button className={cn} {...otherProps} role="button" aria-label={label} type="button">
      {children}
    </button>
  );
}

function Icon({ children, className }: { children: React.ReactNode; className?: string }) {
  const cn = clsx(styles.icon, className);

  return <div className={cn}>{children}</div>;
}

BaseButton.Icon = Icon;

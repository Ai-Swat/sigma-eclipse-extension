import React, { ButtonHTMLAttributes } from 'react';
import clsx from 'clsx';
import styles from '../new-components/ui/base-button/styles.module.css';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  color?:
    | 'primary'
    | 'secondary'
    | 'red'
    | 'outline'
    | 'option-type'
    | 'grey'
    | 'transparent-hover'
    | 'transparent'
    | 'black'
    | 'white'
    | 'grey-with-border';
  size?: 'xs' | 's' | 'default' | 'm' | 'l' | 'xxs';
  iconColor?: 'icon-disabled' | 'icon-tertiary';
  isSelected?: boolean;
  isDisabled?: boolean;
  isDisabledStyles?: boolean;
  label?: string;
  isExtension?: boolean;
}

export default function BaseButton({
  children,
  color = 'primary',
  className,
  size = 'default',
  iconColor = 'icon-disabled',
  isSelected,
  isDisabled,
  isDisabledStyles,
  label,
  isExtension = false,
  ...otherProps
}: ButtonProps) {
  const cn = clsx(
    styles.button,
    styles[color],
    styles[size],
    styles[iconColor],
    className,
    {
      [styles.isSelected]: isSelected,
      [styles.isDisabledStyles]: isDisabledStyles && isDisabled,
      [styles.isExtension]: isExtension,
    }
  );

  return (
    <button
      disabled={isDisabled}
      className={cn}
      {...otherProps}
      role='button'
      aria-label={label}
      type='button'
    >
      {children}
    </button>
  );
}

function Icon({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const cn = clsx(styles.icon, className);

  return <div className={cn}>{children}</div>;
}

BaseButton.Icon = Icon;


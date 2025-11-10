import React, { ClassAttributes, HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { useSettingsStore } from 'src/store/settings'

import css from './styles.module.css'

type HTMLProps<T> = ClassAttributes<T> & HTMLAttributes<T>

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  children: React.ReactNode
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
    | 'grey-with-border'
  size?: 'xs' | 's' | 'default' | 'm' | 'l' | 'xxs'
  iconColor?: 'icon-disabled' | 'icon-tertiary'
  isSelected?: boolean
  isDisabled?: boolean
  isDisabledStyles?: boolean
  label?: string
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
  ...otherProps
}: ButtonProps) {
  const isExtension = useSettingsStore((state) => state.isExtension)
  const cn = clsx(
    css.button,
    css[color],
    css[size],
    css[iconColor],
    className,
    {
      [css.isSelected]: isSelected,
      [css.isDisabledStyles]: isDisabledStyles && isDisabled,
      [css.isExtension]: isExtension,
    }
  )

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
  )
}

function Icon({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  const cn = clsx(css.icon, className)

  return <div className={cn}>{children}</div>
}

BaseButton.Icon = Icon

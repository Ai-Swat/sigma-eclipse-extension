import React, { ClassAttributes, HTMLAttributes } from 'react'
import { clsx } from 'clsx'

import css from './styles.module.css'

type HTMLProps<T> = ClassAttributes<T> & HTMLAttributes<T>

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  children: React.ReactNode
  label?: string
}

export default function CircleButton({
  children,
  className,
  label,
  ...otherProps
}: ButtonProps) {
  const cn = clsx(css.button, className)

  return (
    <button className={cn} {...otherProps} role='button' aria-label={label}>
      {children}
    </button>
  )
}

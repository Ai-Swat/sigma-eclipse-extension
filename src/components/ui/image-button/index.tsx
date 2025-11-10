import React, { ClassAttributes, HTMLAttributes } from 'react'
import { clsx } from 'clsx'
import { useThemeContext } from 'src/contexts/themeContext'

import AutoImage from './images/auto.svg?url'
import AutoImageDark from './images/auto-dark.svg?url'
import { images } from './images/constants'

import css from './styles.module.css'

type HTMLProps<T> = ClassAttributes<T> & HTMLAttributes<T>

interface ButtonProps extends HTMLProps<HTMLButtonElement> {
  children: React.ReactNode
  isSelected?: boolean
  isDisabled?: boolean
}

export default function ImageButton({
  children,
  className,
  isSelected,
  isDisabled,
  ...otherProps
}: ButtonProps) {
  const cn = clsx(css.button, className, {
    [css.isSelected]: isSelected,
  })

  const cnImage = clsx(css.image, {
    [css.isSelected]: isSelected,
  })

  const { theme } = useThemeContext()
  const isDark = theme === 'dark'
  const imgPathName = children?.toString()?.toLowerCase()?.replace(' ', '-')
  const imgPath =
    images[imgPathName as keyof typeof images] || images['realism']

  return (
    <button disabled={isDisabled} className={cn} {...otherProps} role='button'>
      <div className={clsx(css.image, css.hoverBackground)} />
      {children === 'auto' ? (
        <>
          {isDark ? (
            <img
              alt=''
              src={AutoImageDark}
              className={cnImage}
              draggable={false}
            />
          ) : (
            <img alt='' src={AutoImage} className={cnImage} draggable={false} />
          )}
        </>
      ) : (
        <img alt='' src={imgPath} className={cnImage} draggable={false} />
      )}
      {children}
    </button>
  )
}

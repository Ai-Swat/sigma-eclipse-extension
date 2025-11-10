import React from 'react'
import css from './styles.module.css'

interface FlagProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  code: string
  size?: number
}

export const Flag: React.FC<FlagProps> = ({ code, size = 22 }) => {
  const src = `https://flagcdn.com/${code.toLowerCase()}.svg`

  return (
    <img
      src={src}
      alt={`Flag of ${code}`}
      height={size}
      width={size}
      className={css.flag}
      loading='lazy'
      draggable={false}
    />
  )
}

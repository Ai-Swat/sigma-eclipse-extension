import { ReactElement } from 'react'
import { clsx } from 'clsx'

import css from './styles.module.css'

export function PanelItemMobile({
  icon,
  color,
  greyText,
  boldTitle,
}: {
  icon: ReactElement
  greyText?: string
  boldTitle?: string
  color: 'green' | 'blue' | 'violet' | 'orange' | 'black' | 'gradient'
}) {
  return (
    <div className={css.panelItem}>
      <div className={css.innerRow}>
        <div className={clsx(css.iconWrapper, css[color])}>
          <div className={color === 'black' ? css.iconInverse : css.icon}>
            {icon}
          </div>
        </div>
        <span className={css.greyText}>
          <span className={css.bold}>{boldTitle}</span> {greyText}
        </span>
      </div>

      <div />
    </div>
  )
}

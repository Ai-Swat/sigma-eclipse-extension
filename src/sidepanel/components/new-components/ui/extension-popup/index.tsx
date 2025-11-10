import { FC, ReactNode } from 'react'
import { createPortal } from 'react-dom'
import clsx from 'clsx'

import ClearIcon from 'src/images/clear-icon.svg?react'

import styles from './styles.module.css'

interface PopupWrapperProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  className?: string
}

const ExtensionPopupWrapper: FC<PopupWrapperProps> = ({
  isOpen,
  onClose,
  title,
  children,
  className,
}) => {
  if (!isOpen) return null

  return createPortal(
    <div
      className={styles.overlay}
      onClick={(e) => {
        e.stopPropagation()
        onClose()
      }}
    >
      <div
        className={clsx(styles.popup, className)}
        onClick={(e) => e.stopPropagation()}
      >
        <div className={styles.header}>
          <div className={styles.place} />
          {title}
          <div className={styles.iconWrapper} onClick={onClose}>
            <ClearIcon width={22} height={22} className={styles.headerIcon} />
          </div>
        </div>

        <div className={styles.content}>{children}</div>
      </div>
    </div>,
    document.body
  )
}

export default ExtensionPopupWrapper

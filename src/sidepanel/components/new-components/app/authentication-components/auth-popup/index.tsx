import { PropsWithChildren, useRef, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import { clsx } from 'clsx'
import { useSettingsStore } from 'src/store/settings'
import ClearIcon from 'src/images/clear-icon.svg?react'
import { useEvent } from 'src/libs/use/use-event'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { lockScroll, unlockScroll } from 'src/components/ui/popup/utils'
import { CSSTransition } from 'react-transition-group'
import styles from './styles.module.css'

export type PopupProps = {
  visible: boolean
  onClose: () => void
  onClick?: () => void
  className?: string
  variant: 'right' | 'bottom' | 'full' | 'bottom-big' | 'blue' | 'right-blue'
  color?: 'orange'
} & PropsWithChildren

export function AuthPopup({
  visible,
  onClose,
  children,
  onClick,
  className,
  variant,
  color,
}: PopupProps) {
  const [shouldRender, setShouldRender] = useState(visible)
  const [showAnimation, setShowAnimation] = useState(false)

  const isMobile = useMobileDetect()
  const isExtension = useSettingsStore((state) => state.isExtension)
  const isLockScroll = isMobile || variant === 'full'

  const popupRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)

  // 👇 Управляем монтированием и анимацией появления
  useEffect(() => {
    if (visible) {
      setShouldRender(true)
      // Дадим React завершить монтирование, потом активируем анимацию
      requestAnimationFrame(() => setShowAnimation(true))
    } else {
      setShowAnimation(false)
      const timeout = setTimeout(() => setShouldRender(false), 700) // exit = 700ms
      return () => clearTimeout(timeout)
    }
  }, [visible])

  const handleKeydown = useEvent((event: KeyboardEvent) => {
    if (event.code === 'Escape') onClose()
  })

  useEffect(() => {
    if (!visible) return
    window.addEventListener('keydown', handleKeydown)
    if (isLockScroll) lockScroll()
    return () => {
      window.removeEventListener('keydown', handleKeydown)
      if (isLockScroll) unlockScroll()
    }
  }, [visible, handleKeydown, isLockScroll])

  if (typeof window === 'undefined' || !shouldRender) return null

  const cnPopup = clsx(styles.popup, styles[variant], className, {
    [styles.isExtension]: isExtension,
    [styles.orangeGradientBg]: color === 'orange',
  })

  const cnOverlay = clsx(styles.overlay, styles[variant], {
    [styles.isExtension]: isExtension,
  })

  return createPortal(
    <div className={styles.root}>
      <div className={styles.wrapperPopup}>
        <CSSTransition
          in={showAnimation}
          timeout={{ enter: 500, exit: 700 }}
          classNames={{
            enter: styles.overlayEnter,
            enterActive: styles.overlayEnterActive,
            exit: styles.overlayExit,
            exitActive: styles.overlayExitActive,
          }}
          unmountOnExit
          nodeRef={overlayRef}
        >
          <div ref={overlayRef} className={cnOverlay} onClick={onClose} />
        </CSSTransition>

        <CSSTransition
          in={showAnimation}
          timeout={500}
          classNames={{
            enter: styles.enter,
            enterActive: styles.enterActive,
            enterDone: styles.enterDone,
            exit: styles.exit,
            exitActive: styles.exitActive,
          }}
          unmountOnExit
          nodeRef={popupRef}
        >
          <div ref={popupRef} className={cnPopup} onClick={onClick}>
            <div
              role='button'
              className={clsx(styles.closeButton, styles[variant])}
              onClick={onClose}
            >
              <ClearIcon width={24} height={24} className={styles.closeIcon} />
            </div>
            {children}
          </div>
        </CSSTransition>
      </div>
    </div>,
    document.body
  )
}

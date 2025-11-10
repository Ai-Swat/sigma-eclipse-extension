import {
  PropsWithChildren,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import cn, { clsx } from 'clsx'
import { useEvent } from 'src/libs/use/use-event'
import { lockScroll, unlockScroll } from './utils'
import { useSettingsStore } from 'src/store/settings'
import ExtensionPopupWrapper from 'src/components/ui/extension-popup'
import ClearIcon from 'src/images/clear-icon.svg?react'
import styles from './styles.module.css'

export type PopupProps = {
  visible: boolean
  onClose: () => void
  onClick?: () => void
  className?: string
  withCloseButton?: boolean
  fullHeight?: boolean
  title?: string
  isBottomSheet?: boolean
} & PropsWithChildren

export function Popup(props: PopupProps) {
  const {
    visible,
    onClose,
    children,
    onClick,
    className,
    fullHeight,
    withCloseButton,
    title,
    isBottomSheet,
  } = props

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const root = document.body

    if (!root) {
      return
    }

    if (visible) {
      lockScroll()
      window.addEventListener('keydown', handleKeydown)
    }

    return () => {
      unlockScroll()
      window.removeEventListener('keydown', handleKeydown)
    }
  }, [visible])

  const handleClose = useCallback(
    (event: any) => {
      event.stopPropagation()
      onClose()
    },
    [onClose]
  )

  const handleKeydown = useEvent((event: KeyboardEvent) => {
    event.stopPropagation()

    if (event.code === 'Escape') {
      handleClose(event)
    }
  })

  const containerRef = useRef<HTMLDivElement>(null)
  const swipeContentRef = useRef<HTMLDivElement>(null)
  const overlayRef = useRef<HTMLDivElement>(null)
  const [isMounted, setIsMounted] = useState(visible)
  const [animateClass, setAnimateClass] = useState('')
  const isExtension = useSettingsStore((state) => state.isExtension)

  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>

    if (visible) {
      setIsMounted(true)
      requestAnimationFrame(() => {
        if (isBottomSheet) {
          setAnimateClass(styles.popupBottomSheetEnter)
        }
      })
    } else if (isBottomSheet) {
      setAnimateClass(styles.popupBottomSheetExit)
      timeoutId = setTimeout(() => setIsMounted(false), 300) // match animation duration
    } else {
      setIsMounted(false)
    }

    return () => {
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [visible, isBottomSheet])

  if (typeof window === 'undefined') {
    return null
  }

  if (!isMounted) {
    return null
  }

  const cnPopup = clsx(
    styles.popup,
    className,
    {
      [styles.popupFullHeight]: fullHeight,
    },
    isBottomSheet && animateClass
  )

  if (isExtension && !fullHeight) {
    return (
      <ExtensionPopupWrapper title={title} isOpen={visible} onClose={onClose}>
        {children}
      </ExtensionPopupWrapper>
    )
  }

  return (
    <>
      {createPortal(
        <div
          className={clsx(styles.root, {
            [styles.popupFullHeight]: fullHeight,
          })}
          ref={containerRef}
        >
          <div className={styles.wrapperPopup}>
            <div
              className={cn(styles.overlay, {
                [styles.overlayEnter]: isMounted,
                [styles.overlayExit]: !isMounted,
              })}
              onClick={handleClose}
              ref={overlayRef}
            />
            <div
              className={cnPopup}
              onClick={(event) => {
                event.stopPropagation()
                onClick?.()
              }}
              ref={swipeContentRef}
            >
              {withCloseButton && (
                <div
                  role='button'
                  className={clsx(styles.closeButton, {
                    [styles.popupFullHeight]: fullHeight,
                  })}
                  onClick={handleClose}
                >
                  <ClearIcon width={20} height={20} />
                </div>
              )}

              {!fullHeight && <div className={styles.bottomSheetDot} />}

              {title && <div className={styles.title}>{title}</div>}

              {children}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  )
}

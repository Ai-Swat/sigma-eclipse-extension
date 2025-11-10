import { Popup, PopupProps } from '../popup'
import styles from './styles.module.css'
import { PropsWithChildren, ReactElement } from 'react'
import { useSettingsStore } from 'src/store/settings'
import cn from 'clsx'

export default function BottomSheet(
  props: PopupProps &
    PropsWithChildren & {
      title?: string
      button?: ReactElement
      isFullHeight?: boolean
    }
) {
  const isExtension = useSettingsStore((state) => state.isExtension)

  return (
    <Popup
      visible={props.visible}
      onClose={props.onClose}
      isBottomSheet
      className={cn(styles.bottomSheet, {
        [styles.isFullHeight]: props.isFullHeight,
      })}
      title={isExtension ? props.title : ''}
    >
      {props.title && !isExtension && (
        <div className={styles.title}>{props.title}</div>
      )}

      <div className={styles.wrapper}>
        <div
          className={cn({
            [styles.contentWithButton]: props.button,
          })}
        >
          {props.children}
        </div>
      </div>

      {props.button && <div className={styles.fixedButton}>{props.button}</div>}
    </Popup>
  )
}

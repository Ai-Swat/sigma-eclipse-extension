import styles from './styles.module.css'
import { PropsWithChildren } from 'react'
import cn from 'clsx'

export function TabBarWrapper(
  props: PropsWithChildren & { style?: 'with-shadow' }
) {
  return (
    <div
      className={cn(styles.wrapperStyle, {
        [styles.withShadow]: props.style === 'with-shadow',
      })}
    >
      {props.children}
    </div>
  )
}

export function TabBarItem(
  props: PropsWithChildren<{
    isActive?: boolean
    onPress: () => void
    style?: 'with-shadow'
  }>
) {
  return (
    <>
      {props.isActive ? (
        <div
          onClick={props.onPress}
          className={cn(styles.tab, styles.activeTab, {
            [styles.withShadow]: props.style === 'with-shadow',
            [styles.withShadowActive]: props.style === 'with-shadow',
          })}
        >
          <div className={styles.span}>{props.children}</div>
        </div>
      ) : (
        <div
          onClick={props.onPress}
          className={cn(styles.tab, {
            [styles.withShadow]: props.style === 'with-shadow',
          })}
        >
          <div className={cn(styles.span, 'color-text-grey')}>
            {props.children}
          </div>
        </div>
      )}
    </>
  )
}

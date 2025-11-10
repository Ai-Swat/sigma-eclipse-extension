import { PropsWithChildren } from 'react'
import styles from './styles.module.css'
import cn from 'clsx'

export function Badge(
  props: PropsWithChildren & {
    className?: string
    color?: 'white' | 'black' | 'blue'
  }
) {
  return (
    <span
      className={cn(
        styles.badge,
        props.className,
        props.color && styles[props.color]
      )}
    >
      <div className={styles.text}>{props.children}</div>
    </span>
  )
}

export function WhiteBadge(props: {
  text: string
  className?: string
  color?: 'white'
}) {
  return (
    <span
      className={cn(
        styles.soonBadge,
        props.className,
        props.color && styles[props.color]
      )}
    >
      <div className={styles.text}>{props.text}</div>
    </span>
  )
}

import { clsx } from 'clsx'
import styles from './styles.module.css'

export function LoaderBars({ color = 'white' }: { color?: 'black' | 'white' }) {
  return (
    <div className={clsx(styles.ldsSpinner, styles[color])}>
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
      <div />
    </div>
  )
}

import { clsx } from 'clsx'
import { useDictateContext } from 'src/contexts/dictateContext'
import styles from './styles.module.css'

export default function VoiceEqualizer() {
  const { bars } = useDictateContext()
  return (
    <div className={clsx(styles.containerEqualizer, 'opacity-animation')}>
      <div className={styles.gradientLeft} />
      {bars.slice(5).map((h, i) => (
        <div key={i} className={styles.bar} style={{ height: `${h}px` }} />
      ))}
      <div className={styles.gradientRight} />
    </div>
  )
}

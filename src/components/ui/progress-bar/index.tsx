import { useState, useEffect } from 'react'
import css from './styles.module.css'

const ProgressBar = ({
  duration = 5000,
  onComplete,
  isText,
}: {
  duration?: number
  onComplete: () => void
  isText?: boolean
}) => {
  const [progress, setProgress] = useState(0)
  const sec = Math.ceil(((100 - progress) / 100) * (duration / 1000))

  useEffect(() => {
    const interval = 50
    const step = (interval / duration) * 100
    let completed = false

    const intervalId = setInterval(() => {
      setProgress((prev) => {
        const nextProgress = prev + step
        if (nextProgress >= 100) {
          if (!completed) {
            completed = true
            clearInterval(intervalId)
            timeoutId = setTimeout(() => onComplete?.(), 0)
          }
          return 100
        }
        return nextProgress
      })
    }, interval)

    let timeoutId: ReturnType<typeof setTimeout>

    return () => {
      clearInterval(intervalId)
      if (timeoutId) clearTimeout(timeoutId)
    }
  }, [duration, onComplete])

  return (
    <div className={css.container}>
      {isText && (
        <div className={css.text}>Automatically back to home in {sec}s</div>
      )}
      <div className={css.progressContainer}>
        <div className={css.progressBar} style={{ width: `${progress}%` }} />
      </div>
    </div>
  )
}

export default ProgressBar

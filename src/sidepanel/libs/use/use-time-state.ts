import { useState, useRef, useEffect } from 'react'
import { useEvent } from 'src/libs/use/use-event'

export const useTimeState = (initial = false, time = 2000) => {
  const [status, setIsStatus] = useState(initial)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const changeState = useEvent((newStatus: boolean) => {
    setIsStatus(newStatus)

    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    timeoutRef.current = setTimeout(() => {
      setIsStatus(initial)
      timeoutRef.current = null
    }, time)
  })

  // Очистка таймера при размонтировании
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return [status, changeState] as const
}

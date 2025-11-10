import { useCallback } from 'react'
import { copyToClipboard } from '../clipboard'

import { useTimeState } from './use-time-state'

const DELAY = 3000

export function useClipboard() {
  const [status, changeState] = useTimeState(false, DELAY)

  const copyToBuffer = useCallback((str: string) => {
    copyToClipboard(str, (status) => changeState(status))
  }, [])

  return [copyToBuffer, status] as const
}

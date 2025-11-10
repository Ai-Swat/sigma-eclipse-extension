import { useEffect, useState } from 'react'
import { useSettingsStore } from 'src/store/settings'
import { sendMessageToExtension } from 'src/libs/send-message-to-extension'
import ArrowGradient from 'src/images/arrow-down-right-gradient.svg?react'
import styles from './styles.module.css'

export function JumpToLiveItem({ taskId }: { taskId?: string }) {
  const [isActiveTab, setIsActiveTab] = useState(false)
  const isExtension = useSettingsStore((state) => state.isExtension)

  useEffect(() => {
    if (!isExtension || !taskId) return

    try {
      void sendMessageToExtension('CHECK_ACTIVE_TARGET', isExtension, {
        taskId,
      })

      // 2. Слушаем обновления
      const handleMessage = (message: any) => {
        if (
          message?.type === 'SET_ACTIVE_TARGET' &&
          message?.source === 'sigma-service-worker' &&
          message?.to === 'sigma-extension'
        ) {
          setIsActiveTab(true)
        }

        if (
          message?.type === 'CHECK_ACTIVE_TARGET_RESPONSE' &&
          message?.source === 'sigma-service-worker' &&
          message?.to === 'sigma-extension'
        ) {
          setIsActiveTab(true)
        }
      }

      chrome.runtime.onMessage.addListener(handleMessage)
      return () => chrome.runtime.onMessage.removeListener(handleMessage)
    } catch (e) {
      // ignore
    }
  }, [isExtension, taskId])

  if (!isActiveTab) return null

  return (
    <div
      onClick={() => sendMessageToExtension('JUMP_TO_LIVE', true, { taskId })}
      className={styles.wrapper}
    >
      <span className={styles.text}>Jump to Live</span>
      <ArrowGradient />
    </div>
  )
}

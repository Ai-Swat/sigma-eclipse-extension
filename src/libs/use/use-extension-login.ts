import { useEffect } from 'react'
import { EXTENSION_ID_DEV, EXTENSION_ID_PROD } from 'src/config'
import { useSearchStore } from 'src/store'
import { sendMessageToExtension } from '../send-message-to-extension'

export const useExtensionLogin = (isExtension: boolean = false) => {
  const setLoginInformation = useSearchStore(
    (state) => state.setLoginInformation
  )

  useEffect(() => {
    if (!isExtension) return

    void sendMessageToExtension('EXTENSION_READY', isExtension)
  }, [isExtension])

  useEffect(() => {
    if (!isExtension) return

    try {
      const handleMessage = (
        data: any,
        sender: chrome.runtime.MessageSender,
        sendResponse: (response?: any) => void
      ) => {
        const allowedOrigin = [EXTENSION_ID_DEV, EXTENSION_ID_PROD]
        if (sender?.id && !allowedOrigin.includes(sender.id)) return

        if (
          !data ||
          typeof data !== 'object' ||
          data.source !== 'sigma-app' ||
          data.type !== 'LOGIN_RESULT'
        )
          return

        const message = data.payload?.message
        if (
          typeof message.access_token !== 'string' ||
          typeof message.refresh_token !== 'string' ||
          typeof message.user_id !== 'string' ||
          typeof message.session_id !== 'string'
        )
          return

        setLoginInformation(message)
        sendResponse?.({ ok: true }) // Можно отправить ответ обратно
      }

      chrome.runtime.onMessage.addListener(handleMessage)

      return () => chrome.runtime.onMessage.removeListener(handleMessage)
    } catch (e) {
      // ignore
    }
  }, [isExtension])
}

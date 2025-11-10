import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { sendMessageToExtension } from 'src/libs/send-message-to-extension'
import { ExtensionMessage } from 'src/store/types'

interface UseExtensionMessagesProps {
  isExtension?: boolean
  isLogIn?: boolean
  hash: string
  path: string
  getUser: () => void
  handleLogOut: (sendMessage?: boolean) => void
}

export function useExtensionMessages({
  isExtension,
  isLogIn,
  hash,
  path,
  getUser,
  handleLogOut,
}: UseExtensionMessagesProps) {
  const navigate = useNavigate()

  // Уведомление об успешной подписке
  useEffect(() => {
    if (hash === '#success-payment') {
      sendMessageToExtension('SUBSCRIPTION_PURCHASED', isExtension)
    }
  }, [hash, isExtension])

  // Сообщения из extension
  useEffect(() => {
    if (!isExtension) return

    const handleExtensionMessage = (message: ExtensionMessage) => {
      if (
        message.type === 'SUBSCRIPTION_PURCHASED' &&
        message.source === 'sigma-service-worker'
      ) {
        navigate(path)
        getUser()
      }
      if (
        message.type === 'RUN_LOGOUT' &&
        message.source === 'sigma-service-worker' &&
        isLogIn
      ) {
        handleLogOut(false)
      }
    }

    chrome.runtime.onMessage.addListener(handleExtensionMessage)
    return () => chrome.runtime.onMessage.removeListener(handleExtensionMessage)
  }, [isExtension, isLogIn, path, getUser, handleLogOut])

  // Сообщения из content-script
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (
        event.data?.type === 'RUN_LOGOUT' &&
        event.data?.source === 'sigma-content-script' &&
        isLogIn
      ) {
        handleLogOut(false)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [isLogIn, handleLogOut])
}

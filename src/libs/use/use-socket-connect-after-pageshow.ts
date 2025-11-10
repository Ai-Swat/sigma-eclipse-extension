import { useEffect, useRef } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'

export const useSocketConnectAfterPageshow = () => {
  const { connectSocket, disconnectSocket, is_log_in, user } = useSearchStore(
    useShallow((state) => ({
      connectSocket: state.connectSocket,
      disconnectSocket: state.disconnectSocket,
      is_log_in: state.is_log_in,
      user: state.user,
    }))
  )

  const isLogIn = Boolean(is_log_in && user)
  const prevIsLogIn = useRef<boolean | null>(null)

  // Подключение при монтировании
  useEffect(() => {
    connectSocket?.()

    return () => {
      disconnectSocket?.()
    }
  }, [connectSocket, disconnectSocket])

  // Переподключение при смене is_log_in
  useEffect(() => {
    if (prevIsLogIn.current !== null && prevIsLogIn.current !== isLogIn) {
      disconnectSocket?.()
      connectSocket?.()
    }

    prevIsLogIn.current = is_log_in
  }, [isLogIn, connectSocket, disconnectSocket])

  // Переподключение при pageshow
  useEffect(() => {
    const handlePageshow = () => {
      connectSocket?.()
    }

    window.addEventListener('pageshow', handlePageshow)

    return () => {
      window.removeEventListener('pageshow', handlePageshow)
    }
  }, [connectSocket])
}

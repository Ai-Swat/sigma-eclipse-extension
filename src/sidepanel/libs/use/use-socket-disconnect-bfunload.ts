import { useEffect } from 'react'
import { useSearchStore } from 'src/store'

// For Back/forward cache
export const useSocketDisconnectBfUnload = () => {
  const disconnectSocket = useSearchStore((state) => state.disconnectSocket)

  useEffect(() => {
    const disconnectSocketBeforeUnload = () => {
      disconnectSocket()
    }

    window.addEventListener('beforeunload', disconnectSocketBeforeUnload)

    return () => {
      window.removeEventListener('beforeunload', disconnectSocketBeforeUnload)
    }
  }, [])
}

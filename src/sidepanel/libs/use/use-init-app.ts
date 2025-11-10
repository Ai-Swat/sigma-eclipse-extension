import { useEffect } from 'react'
import { useSearchStore } from 'src/store'
import { useShallow } from 'zustand/react/shallow'

export function useInitApp() {
  const { getUserHistory, refreshToken, is_log_in, getPlans } = useSearchStore(
    useShallow((state) => ({
      getUserHistory: state.getUserHistory,
      refreshToken: state.refreshToken,
      is_log_in: state.is_log_in,
      getPlans: state.getPlans,
    }))
  )

  const init = async () => {
    await refreshToken()
    getPlans()
    getUserHistory()
  }

  useEffect(() => {
    if (!is_log_in) return

    void init()
  }, [is_log_in])
}

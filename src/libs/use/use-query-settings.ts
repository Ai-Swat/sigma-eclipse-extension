import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { useEvent } from 'src/libs/use/use-event'
import { useSettingsStore } from 'src/store/settings'
import { useShallow } from 'zustand/react/shallow'

export const useQuerySettings = () => {
  const { setIsWidget, setForcedTheme } = useSettingsStore(
    useShallow((state) => ({
      setIsWidget: state.setIsWidget,
      setForcedTheme: state.setForcedTheme,
    }))
  )
  const setIsWidgetTrue = useEvent(() => setIsWidget(true))
  const setForcedThemeEvent = useEvent((theme: 'dark' | 'white') =>
    setForcedTheme(theme)
  )

  const [mounted, setMounted] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const widgetQuery = searchParams.get('widget')

    if (widgetQuery === 'true') {
      setIsWidgetTrue()
      setForcedThemeEvent('white')
      return
    }
  }, [mounted])
}

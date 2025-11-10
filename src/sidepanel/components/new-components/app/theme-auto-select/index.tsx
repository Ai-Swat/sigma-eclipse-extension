import { useEffect, useState } from 'react'

import { useThemeContext } from 'src/contexts/themeContext'
import { useSettingsStore } from 'src/store/settings'

export function ThemeAutoSelect() {
  const { theme } = useThemeContext()
  const forcedTheme = useSettingsStore((state) => state.forcedTheme)

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!mounted) return

    const html = document.documentElement
    const newTheme = forcedTheme || theme

    html.className = `theme-${newTheme}`
  }, [theme, mounted])

  return null
}

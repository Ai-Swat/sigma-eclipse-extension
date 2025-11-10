import { useEffect } from 'react'

export function usePreloadPages(pages: Array<{ preload?: () => void }>) {
  useEffect(() => {
    const preload = () => {
      pages.forEach((page) => {
        page.preload?.()
      })
    }

    if ('requestIdleCallback' in window) {
      ;(window as any).requestIdleCallback(preload, { timeout: 2000 })
    } else {
      const timer = setTimeout(preload, 2000)
      return () => clearTimeout(timer)
    }
  }, [])
}

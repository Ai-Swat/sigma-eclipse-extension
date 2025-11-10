import { useCallback, useEffect, useRef, useState } from 'react'
import { debounce } from 'src/libs/debounce'

export default function useStickyHeader<T extends HTMLElement>(
  scrollContainerId?: string,
  scrollThreshold: number = 30
) {
  const [isSticky, setSticky] = useState(false)
  const headerRef = useRef<T>(null)
  const prevScrollPosition = useRef(0)
  const scrollContainerRef = useRef<HTMLElement | Window | null>(null)

  // Определяем scroll container
  useEffect(() => {
    if (scrollContainerId) {
      const el = document.getElementById(scrollContainerId)
      scrollContainerRef.current = el ?? window
    } else {
      scrollContainerRef.current = window
    }
  }, [scrollContainerId])

  // Основная логика скролла
  const handleScroll = useCallback(
    debounce(() => {
      const container = scrollContainerRef.current

      const scrollTop =
        container instanceof Window
          ? window.scrollY ||
            document.documentElement.scrollTop ||
            document.body.scrollTop ||
            0
          : container?.scrollTop ?? 0

      const prev = prevScrollPosition.current

      if (scrollTop < prev && scrollTop > scrollThreshold) {
        // Скролл вверх и не в самом верху
        setSticky(true)
      } else if (scrollTop > prev) {
        // Скролл вниз
        setSticky(false)
      }

      prevScrollPosition.current = scrollTop
    }, 50),
    [scrollThreshold]
  )

  useEffect(() => {
    const container = scrollContainerRef.current
    if (!container) return

    const target = container instanceof Window ? window : container

    target.addEventListener('scroll', handleScroll)
    return () => {
      target.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  return { headerRef, isSticky }
}

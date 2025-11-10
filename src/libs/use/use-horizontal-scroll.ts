import { useEffect, useRef, useCallback } from 'react'

export const useHorizontalScroll = () => {
  const scrollRef = useRef<HTMLDivElement>(null)

  const getSectionWidth = () => {
    const el = scrollRef.current
    if (!el) return 0
    return el.scrollWidth / 3
  }

  const normalizeScroll = useCallback(() => {
    const el = scrollRef.current
    if (!el) return

    const sectionWidth = getSectionWidth()

    // зацикливание: переносим скролл в центр
    if (el.scrollLeft <= 0) {
      el.scrollLeft = sectionWidth
    } else if (el.scrollLeft >= sectionWidth * 2) {
      el.scrollLeft = sectionWidth
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return

    // при маунте ставим в центр
    const sectionWidth = getSectionWidth()
    el.scrollLeft = sectionWidth

    const handleScroll = () => {
      // даём инерции тачпада "закончиться"
      requestAnimationFrame(() => normalizeScroll())
    }

    el.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', normalizeScroll)

    return () => {
      el.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', normalizeScroll)
    }
  }, [normalizeScroll])

  const scrollByAmount = 600 // px

  const scrollLeft = () => {
    scrollRef.current?.scrollBy({ left: -scrollByAmount, behavior: 'smooth' })
  }

  const scrollRight = () => {
    scrollRef.current?.scrollBy({ left: scrollByAmount, behavior: 'smooth' })
  }

  return {
    scrollRef,
    scrollLeft,
    scrollRight,
  }
}

import { useState, useEffect, useRef } from 'react'

export default function useScrollDirection() {
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(
    null
  )
  const prevScrollPosition = useRef<number>(0)

  useEffect(() => {
    function handleScroll() {
      const currentScrollPosition =
        window.scrollY || document.documentElement.scrollTop

      if (
        currentScrollPosition > prevScrollPosition.current &&
        scrollDirection !== 'down'
      ) {
        setScrollDirection('down')
      } else if (
        currentScrollPosition < prevScrollPosition.current &&
        scrollDirection !== 'up'
      ) {
        setScrollDirection('up')
      }

      prevScrollPosition.current = currentScrollPosition
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [prevScrollPosition])

  return scrollDirection
}

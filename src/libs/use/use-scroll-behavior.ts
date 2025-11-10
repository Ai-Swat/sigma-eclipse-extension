import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'

export function useScrollBehavior() {
  const location = useLocation()
  const [scrollBehavior, setScrollBehavior] = useState<'instant' | 'smooth'>(
    'instant'
  )

  useEffect(() => {
    setScrollBehavior('instant')
  }, [location.search])

  return [scrollBehavior, setScrollBehavior] as const
}

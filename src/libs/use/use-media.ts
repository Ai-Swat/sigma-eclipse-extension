import { useState, useEffect } from 'react'

type Options = {
  min?: boolean
}

export const useMedia = (query: string, options?: Options) => {
  const isMin = !!options?.min
  const queryAdapted = isMin
    ? `(min-width: ${query}px)`
    : `(max-width: ${query}px)`

  const isWindow = typeof window !== 'undefined'

  const [matches, setMatches] = useState(
    isWindow ? window.matchMedia?.(queryAdapted).matches : false
  )

  useEffect(() => {
    if (!window?.matchMedia) return

    const media = window.matchMedia(queryAdapted)
    const listener = () => setMatches(media?.matches)

    if (media.addEventListener) {
      media.addEventListener('change', listener)
    } else {
      media.addListener(listener)
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener('change', listener)
      } else {
        media.removeListener(listener)
      }
    }
  }, [queryAdapted])

  return matches
}

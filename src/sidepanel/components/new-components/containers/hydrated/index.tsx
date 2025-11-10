import { PropsWithChildren, useEffect, useState } from 'react'

interface HydratedProps extends PropsWithChildren {
  fallbackHeight?: number
}

export const Hydrated = ({ children, fallbackHeight }: HydratedProps) => {
  const [hydration, setHydration] = useState(false)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHydration(true)
    }
  }, [])

  if (fallbackHeight !== undefined)
    return hydration ? children : <div style={{ minHeight: fallbackHeight }} />

  return hydration ? children : null
}

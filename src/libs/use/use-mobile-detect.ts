// vendor
import { useEffect, useState } from 'react'

// utils
import { debounce } from 'src/libs/debounce'

// constants
export const MOBILE_WIDTH = 767
export const TABLET_WIDTH = 1023
const DEBOUNCE_DELAY = 120

const useMobileDetect = (type?: 'tablet'): boolean => {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  const checkIsMobile = () => {
    const userAgent =
      typeof window.navigator === 'undefined' ? '' : navigator.userAgent
    const isMobileAgent = Boolean(
      userAgent.match(
        /Android|BlackBerry|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i
      )
    )

    const isMobileWidth =
      window.innerWidth < (type === 'tablet' ? TABLET_WIDTH : MOBILE_WIDTH)

    if (isMobileAgent || isMobileWidth) {
      setIsMobile(true)
      return
    }
    setIsMobile(false)
  }

  const debouncedCheck = debounce(checkIsMobile, DEBOUNCE_DELAY)

  useEffect(() => {
    checkIsMobile()
    window.addEventListener('resize', debouncedCheck)
    return () => {
      window.removeEventListener('resize', debouncedCheck)
    }
  }, [])

  return isMobile
}

export default useMobileDetect

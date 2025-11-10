import { useState, useEffect } from 'react'

const useMobileOs = () => {
  const [isIOS, setIsIOS] = useState(false)
  const [isSafari, setIsSafari] = useState(false)
  const [isAndroid, setIsAndroid] = useState(false)

  useEffect(() => {
    const userAgent = window.navigator.userAgent

    const isIOS = /iPad|iPhone|iPod/i.test(userAgent)
    setIsIOS(isIOS)

    const webkit = !!userAgent.match(/WebKit/i)
    const iOSSafari = isIOS && webkit && !userAgent.match(/CriOS/i)
    setIsSafari(iOSSafari)

    const isAndroid = /(android)/i.test(userAgent)
    setIsAndroid(isAndroid)
  }, [])

  return { isIOS, isSafari, isAndroid, isMobile: isIOS || isAndroid }
}

export default useMobileOs

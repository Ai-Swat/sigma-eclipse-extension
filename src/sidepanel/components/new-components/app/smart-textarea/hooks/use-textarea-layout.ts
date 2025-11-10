import React, { useState, useCallback } from 'react'
import useMobileDetect from 'src/libs/use/use-mobile-detect'

export const useTextareaLayout = () => {
  const [isGradientShow, setIsGradientShow] = useState(false)
  const isMobile = useMobileDetect()

  const handleInputHeight = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const el = e.target

      el.style.height = 'auto'
      el.style.height = el.scrollHeight + 'px'

      // Управление градиентом
      const maxHeight = isMobile ? 90 : 140
      if (el.scrollHeight > maxHeight) {
        setIsGradientShow(true)
      } else if (el.scrollHeight < maxHeight) {
        setIsGradientShow(false)
      }
    },
    [isMobile]
  )

  return {
    isGradientShow,
    handleInputHeight,
  }
}

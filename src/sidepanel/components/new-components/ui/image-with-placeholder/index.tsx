import React, { useState, useCallback, useEffect } from 'react'
import { clsx } from 'clsx'
import { useThemeContext } from 'src/contexts/themeContext'
import { type ResourceType, fallbackImageUrl } from './utils'

import css from './styles.module.css'

interface ImageWithPlaceholderProps {
  src?: string
  alt: string
  srcFallback?: string
  resourceType?: ResourceType
  className?: string
  wrapperClassName?: string
  imageClick?: React.MouseEventHandler<HTMLImageElement>
  onLoadError?: (error: boolean) => void
}

const ImageWithPlaceholder: React.FC<ImageWithPlaceholderProps> = (props) => {
  const {
    src,
    alt,
    resourceType = 'image',
    className,
    wrapperClassName,
    imageClick,
    onLoadError,
  } = props

  const { theme } = useThemeContext()
  const isDark = theme === 'dark'
  const fallbackImageSrc = fallbackImageUrl(resourceType, isDark)

  const [hasError, setHasError] = useState(false)
  const [loaded, setLoaded] = useState(false)

  // если src поменялся — сбрасываем флаг ошибки и статусы
  useEffect(() => {
    setHasError(false)
    setLoaded(false)
  }, [src])

  const handleImgLoad = useCallback(() => {
    setLoaded(true)
    setHasError(false)
    onLoadError?.(false)
  }, [onLoadError])

  const handleImgLoadError = useCallback(() => {
    setLoaded(true)
    setHasError(true)
    onLoadError?.(true)
  }, [onLoadError])

  const imageCn = clsx(css.image, { [css.loaded]: loaded }, className)
  const wrapperCn = clsx(css.imageWithPlaceholderWrapper, wrapperClassName)

  return (
    <div className={wrapperCn}>
      {!hasError ? (
        <img
          src={src}
          alt={alt}
          referrerPolicy='strict-origin-when-cross-origin'
          draggable={false}
          className={imageCn}
          onLoad={handleImgLoad}
          onError={handleImgLoadError}
          onClick={imageClick}
          loading='lazy'
        />
      ) : (
        <img
          src={fallbackImageSrc}
          alt={alt}
          draggable={false}
          className={imageCn}
          onClick={imageClick}
        />
      )}
    </div>
  )
}

export default ImageWithPlaceholder

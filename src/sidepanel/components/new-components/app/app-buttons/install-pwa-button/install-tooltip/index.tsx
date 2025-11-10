import logoImage from './logo.svg'
import CrossIcon from 'src/images/clear-icon.svg?react'

import css from './styles.module.css'
import { useEffect, useState, useCallback } from 'react'
import cn from 'clsx'

export const InstallTooltip = ({ onClose }: { onClose: () => void }) => {
  const [isShow, setIsShow] = useState(true)

  const handleClose = useCallback(() => {
    setIsShow(false)
  }, [])

  useEffect(() => {
    const autoHideTimer = setTimeout(handleClose, 10000)
    return () => clearTimeout(autoHideTimer)
  }, [handleClose])

  useEffect(() => {
    if (!isShow) {
      const closeTimer = setTimeout(() => {
        onClose()
      }, 700) // подождать завершения анимации
      return () => clearTimeout(closeTimer)
    }
  }, [isShow, onClose])

  return (
    <div className={cn(css.wrapper, { [css.fadeOut]: !isShow })}>
      <CrossIcon className={css.crossIcon} onClick={handleClose} />

      <img src={logoImage} className={css.img} alt='' draggable={false} />
      <div className={css.text}>
        Sigma now
        <br />
        available on Desktop!
      </div>
    </div>
  )
}

// vendor
import { useState } from 'react'
import YouTube from 'react-youtube'
import { clsx } from 'clsx'

// lib
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { isElementInViewport } from 'src/libs/utils'

// styles
import css from './styles.module.css'

interface IProps {
  videoId: string
  onClose?: () => void
  openLink?: () => void
  playerClassName?: string
  opts?: {
    [x: string]: unknown
  } | null
}

const VideoPlayer = ({ videoId, openLink, opts, playerClassName }: IProps) => {
  const isMobile = useMobileDetect()
  const [loading, setLoading] = useState(true)

  const handleError = () => {
    setLoading(false)
    const element = document.getElementById(videoId)
    if (isElementInViewport(element)) {
      openLink?.()
    }
  }

  const handleOnReady = () => {
    setLoading(false)
  }

  const playerCn = clsx(
    css.player,
    { [css.visible]: !loading },
    playerClassName
  )

  const _opts = opts || {
    height: isMobile ? '220' : '370',
    width: isMobile ? '300' : '600',
  }

  return (
    <div className={css.root}>
      {loading && <div className={css.loader} />}
      <YouTube
        className={playerCn}
        videoId={videoId}
        opts={_opts}
        onError={handleError}
        onReady={handleOnReady}
      />
    </div>
  )
}

export default VideoPlayer

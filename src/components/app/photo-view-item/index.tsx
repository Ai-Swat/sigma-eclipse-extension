import { useState } from 'react'
import { clsx } from 'clsx'
import { PhotoView } from 'react-photo-view'

// types
import type { GalleryItem } from 'src/store/types'
import { VideoItems } from 'src/store/types'

// utils
import { isVideoItem, isImageItem } from 'src/libs/utils'
import { extractVideoId } from 'src/libs/utils'

// UI
import ImageWithPlaceholder from 'src/components/ui/image-with-placeholder'
import YoutubePlayer from './components/youtube-player'

// icons
import PlayerIcon from 'src/images/player-icon.svg?react'

// styles
import css from './styles.module.css'

export function guardIsVideoItem(response: unknown): response is VideoItems {
  return !!(response && typeof response === 'object' && 'link' in response)
}

interface IProps {
  item: GalleryItem
  className?: string
  isFirst?: boolean
}

function PhotoViewItem(props: IProps) {
  const { className, item, isFirst } = props

  const openLinkInNewTab = () => {
    if (!isVideoItem(item)) return

    const link = guardIsVideoItem(item) && item?.link && item.link

    if (link) {
      const newTab = window.open(link, '_blank')
      newTab && newTab.focus()
    }
  }

  const videoId =
    guardIsVideoItem(item) && item?.link && extractVideoId(item.link)

  const width = 360
  const height = 220

  const [isErrorImageLoading, setIsErrorImageLoading] = useState(false)

  return (
    <>
      {isVideoItem(item) && (
        <PhotoView
          width={width}
          height={height}
          key={item?.link}
          render={({ attrs }) => {
            return (
              <div {...attrs}>
                <div className={css.videoContainer}>
                  {videoId ? (
                    <div id={videoId}>
                      <YoutubePlayer
                        videoId={videoId}
                        openLink={openLinkInNewTab}
                        opts={{
                          height: '100%',
                          width: '100%',
                        }}
                      />
                    </div>
                  ) : (
                    <div
                      className={clsx(
                        css.imageWrapper,
                        css.videoWrapper,
                        css.fullVideoWrapper,
                        className
                      )}
                      onClick={openLinkInNewTab}
                    >
                      <ImageWithPlaceholder
                        src={item.thumbnail}
                        alt='video thumbnail'
                        resourceType='video'
                        wrapperClassName={css.bigImageWithPlaceholder}
                      />

                      <span className={clsx(css.playerIcon, css.isBig)}>
                        <PlayerIcon />
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )
          }}
        >
          <div>
            {!isFirst && (
              <div
                className={clsx(css.imageWrapper, css.videoWrapper, className)}
              >
                <ImageWithPlaceholder
                  src={item.thumbnail}
                  alt='video thumbnail'
                  resourceType='video'
                />

                <span className={css.playerIcon}>
                  <PlayerIcon />
                </span>
              </div>
            )}
          </div>
        </PhotoView>
      )}

      {isImageItem(item) && (
        <>
          {item.original && !isErrorImageLoading ? (
            <PhotoView src={item.original} key={item.original}>
              <div>
                <ImageWithPlaceholder
                  onLoadError={setIsErrorImageLoading}
                  src={item.original}
                  alt='picture'
                  wrapperClassName={clsx(css.imageWrapper, className)}
                  srcFallback={item.original}
                />
              </div>
            </PhotoView>
          ) : (
            <ImageWithPlaceholder
              src={item.thumbnail}
              key={item?.original}
              alt='picture'
              srcFallback={item.thumbnail}
              onLoadError={setIsErrorImageLoading}
              wrapperClassName={clsx(
                css.imageWrapper,
                css.emptyPlaceholder,
                className
              )}
            />
          )}
        </>
      )}
    </>
  )
}

export default PhotoViewItem

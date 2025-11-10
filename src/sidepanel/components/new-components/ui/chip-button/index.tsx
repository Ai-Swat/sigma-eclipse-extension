import type { PropsWithChildren } from 'react'
import { clsx } from 'clsx'
import { FollowUpType } from 'src/store/types'
import ImageIcon from 'src/images/models/image.svg?react'
import TextGenerationIcon from 'src/images/models/text.svg?react'
import SearchIcon from 'src/images/models/web-search.svg?react'
import TelegramIcon from 'src/images/models/telegram.svg?react'
import styles from './styles.module.css'

interface Props {
  className?: string
  onClick?: () => void
  isSelected?: boolean
  type?: FollowUpType
  id?: string
}

export function ChipButton({
  className,
  onClick,
  children,
  type,
  id,
}: PropsWithChildren & Props) {
  const isImageFollowUp = type === FollowUpType.IMAGE
  const isTextGenFollowUp = type === FollowUpType.TEXT_GENERATOR
  const isSearchFollowUp = type === FollowUpType.SEARCH
  const isTelegramFollowUp = type === FollowUpType.TELEGRAM

  const cnWrapper = clsx(styles.chip, className, {
    [styles.withType]: type !== undefined,
    [styles.image]: isImageFollowUp,
    [styles.text]: isTextGenFollowUp,
    [styles.search]: isSearchFollowUp,
    [styles.telegram]: isTelegramFollowUp,
  })

  return (
    <div id={id} className={cnWrapper} onClick={onClick}>
      {type && (
        <div className={styles.icon}>
          {isSearchFollowUp && <SearchIcon width={20} height={20} />}
          {isTelegramFollowUp && <TelegramIcon width={22} height={22} />}
          {isImageFollowUp && <ImageIcon width={20} height={20} />}
          {isTextGenFollowUp && <TextGenerationIcon width={20} height={20} />}
        </div>
      )}

      {children}
    </div>
  )
}

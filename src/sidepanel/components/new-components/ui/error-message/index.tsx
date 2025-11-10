import { PropsWithChildren } from 'react'
import cn from 'clsx'
import { FollowUpType, TypeFollowUp } from 'src/store/types'
import { useEvent } from 'src/libs/use/use-event'
import { useRewriteFollowUp } from 'src/libs/use/use-rewrite-follow-up'
import BaseButton from '../base-button'
import ImageFace from 'src/images/confused-face.png'
import ImageFaceCensor from 'src/images/censor-face.png'

import styles from './styles.module.css'

export function ErrorMessage({
  className,
  item,
}: PropsWithChildren & {
  className?: string
  item: Partial<TypeFollowUp>
}) {
  const isImageWrapper = item.followup_type === FollowUpType.IMAGE
  const isCensorshipError =
    isImageWrapper &&
    (item?.error_message === 'censorship-error' ||
      item?.error === 'censorship-error')

  const { callRewriteFollowUp } = useRewriteFollowUp()

  const handleRegenerate = useEvent(async () => {
    await callRewriteFollowUp({
      id: item.id,
      parent_id: item.parent_id,
      query_type: item.followup_type as FollowUpType,
    })
  })

  return (
    <span
      className={cn(styles.errorWrapper, className, {
        [styles.imageWrapper]: isImageWrapper,
      })}
    >
      {isImageWrapper && !isCensorshipError && (
        <img
          src={ImageFace}
          className={styles.image}
          alt=''
          draggable={false}
        />
      )}

      {isImageWrapper && isCensorshipError && (
        <img
          src={ImageFaceCensor}
          className={styles.image}
          alt=''
          draggable={false}
        />
      )}

      <div
        className={cn(styles.textBlock, {
          [styles.imageWrapper]: isImageWrapper,
        })}
      >
        {isCensorshipError ? (
          <div>Unsaved Content</div>
        ) : (
          <div>Oops! Something went wrong</div>
        )}

        {isCensorshipError ? (
          <div>
            Your request includes content that can’t be saved. Please try a
            different prompt
          </div>
        ) : (
          <div>Please, try again</div>
        )}
      </div>

      {!isCensorshipError && (
        <BaseButton
          color='black'
          size='default'
          className={styles.button}
          onClick={handleRegenerate}
        >
          Try Again
        </BaseButton>
      )}
    </span>
  )
}

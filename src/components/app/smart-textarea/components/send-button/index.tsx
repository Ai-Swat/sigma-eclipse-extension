import React, { memo, useCallback, useEffect, useState } from 'react'
import { clsx } from 'clsx'
// Removed useSearchStore - simplified for extension
import ArrowIcon from 'src/images/arrow-left.svg?react'
import css from './styles.module.css'

export const SendButton = memo(
  ({
    onClick,
    isActive,
    followup_id,
    thread_id,
    disabled,
    isEnd,
    isLimitExceeded,
    created_at,
    isWaitingUserClarification,
    isExtension,
  }: {
    onClick?: () => void
    isActive?: boolean
    followup_id?: string
    thread_id?: string
    disabled?: boolean
    isEnd?: boolean
    isLimitExceeded?: boolean
    created_at?: string
    isWaitingUserClarification?: boolean
    isExtension?: boolean
  }) => {
    // Simplified stubs for extension
    const isStartSearch = false
    const cancelFollowup = () => {}

    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        if (!isActive || disabled) return
        onClick?.()
        setIsStopButtonClicked(false) // кнопка STOP отображается. ✅
      },
      [isActive, disabled, onClick]
    )

    const handleStopClick = useCallback(
      (event: React.MouseEvent<HTMLDivElement>) => {
        event.stopPropagation()
        if (disabled || !followup_id) return
        cancelFollowup(followup_id, thread_id)
        setIsStopButtonClicked(true) // кнопка STOP больше не показывается. ✅
      },
      [disabled, followup_id, cancelFollowup]
    )

    const [isStopButtonClicked, setIsStopButtonClicked] = useState(false)
    const [isContinuedFollowup, setIsContinuedFollowup] = useState(false)

    // Если сменился followup_id или created_at,
    // кнопка STOP снова может появиться. ✅
    useEffect(() => {
      requestAnimationFrame(() => {
        setIsStopButtonClicked(false)
      })
    }, [followup_id, created_at])

    // Разбор условий:
    // STOP не отображается, если isEnd = true. ✅
    // STOP не отображается, если !isStartSearch && isLimitExceeded. ✅
    // STOP не отображается, если isWaitingUserClarification = true и введен запрос пользователя. ✅
    // В остальных случаях → isShow = true → кнопка STOP отображается. ✅
    useEffect(() => {
      if (!followup_id) return

      let isShow = !isEnd

      if (!isStartSearch && isLimitExceeded) {
        isShow = false
      }

      if (
        isWaitingUserClarification !== undefined &&
        isWaitingUserClarification &&
        isActive
      ) {
        isShow = false
      }

      setIsContinuedFollowup(isShow)
    }, [
      isEnd,
      followup_id,
      isLimitExceeded,
      isWaitingUserClarification,
      isStartSearch,
      isActive,
    ])

    const showStopButton = !isStopButtonClicked && isContinuedFollowup

    return (
      <div
        className={clsx({
          [css.wrapper]: !showStopButton,
          [css.stopButton]: showStopButton,
          [css.notActive]: !isActive,
          [css.isExtension]: isExtension,
        })}
        onClick={showStopButton ? handleStopClick : handleClick}
      >
        {!showStopButton && <ArrowIcon className={css.icon} />}
      </div>
    )
  },
  (prevProps, nextProps) => {
    let shouldRerender = false

    // Список ключевых пропсов для сравнения
    const keys: (keyof typeof prevProps)[] = [
      'onClick',
      'isActive',
      'disabled',
      'followup_id',
      'thread_id',
      'created_at',
      'isEnd',
      'isLimitExceeded',
      'isWaitingUserClarification',
    ]

    keys.forEach((key) => {
      if (prevProps[key] !== nextProps[key]) {
        shouldRerender = true
      }
    })

    // true — пропсы равны, ререндер не нужен
    // false — пропсы изменились, ререндер нужен
    return !shouldRerender
  }
)

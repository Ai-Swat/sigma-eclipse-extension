import React, { useCallback } from 'react'
import { clsx } from 'clsx'
import { wait } from 'src/libs/wait'
import ClipIcon from 'src/images/clip.svg?react'
import css from './styles.module.css'

export function ClipButton({
  disabled,
  onClose,
  fileInputRef,
}: {
  disabled?: boolean
  onClose: () => void
  fileInputRef: React.RefObject<HTMLInputElement>
}) {
  const handleClick = useCallback(async (event: any) => {
    event.stopPropagation()
    event.preventDefault()
    onClose()
    await wait(100)
    fileInputRef.current?.click()
  }, [])

  return (
    <div
      onClick={handleClick}
      className={clsx(css.wrapper, { [css.disabled]: disabled })}
    >
      <ClipIcon width={20} height={20} className={css.icon} />
      <div>Add photos or files</div>
    </div>
  )
}

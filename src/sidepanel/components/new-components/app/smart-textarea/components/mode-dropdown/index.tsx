import React, { useCallback, useRef } from 'react'
import { clsx } from 'clsx'

import { useFileContext } from 'src/contexts/fileContext'
import { ACCEPTS } from 'src/components/app/drag-n-drop-wrapper/constants'

import { TooltipDefault } from 'src/components/ui/tooltip'
import { DropdownItemType } from 'src/components/ui/dropdown'
import IconPlus from 'src/images/plus.svg?react'

import css from './styles.module.css'

export function ModeDropdown({
  activeSearchType,
  setActiveSearchType,
  isExtension,
  isDisabled,
}: {
  activeSearchType: DropdownItemType | undefined
  setActiveSearchType: (item: DropdownItemType) => void
  isExtension?: boolean
  isDisabled?: boolean
}) {
  const { processAndLimitFiles } = useFileContext()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files && Array.from(e.target.files)
      if (!files) return
      processAndLimitFiles(files)
    },
    [processAndLimitFiles]
  )

  const triggerButton = (
    <button
      aria-label='Add Files'
      className={clsx(css.buttonWrapper, 'relative')}
      onClick={(event) => {
        event.stopPropagation()
        if (isDisabled) return

        fileInputRef.current?.click()
      }}
    >
      <TooltipDefault text='Add Files'>
        <div
          className={clsx(css.button, 'ignore-click-outside', {
            [css.isDisabled]: isDisabled,
            [css.isExtension]: isExtension,
          })}
        >
          <IconPlus width={20} height={20} className={css.icon} />
        </div>
      </TooltipDefault>
    </button>
  )

  return (
    <>
      <input
        ref={fileInputRef}
        hidden
        type='file'
        multiple
        onClick={(event) => event.stopPropagation()}
        accept={ACCEPTS.join(', ')}
        onChange={handleFileChange}
      />

      {triggerButton}
    </>
  )
}

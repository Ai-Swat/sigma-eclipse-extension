import React, { useCallback, useRef, useState } from 'react'
import { clsx } from 'clsx'

import { useFileContext } from 'src/contexts/fileContext'
import { TooltipDefault } from 'src/components/ui/tooltip'
import IconPlus from 'src/images/plus.svg?react'
import FileTypeDropdown, { FileType } from './FileTypeDropdown'

import css from './styles.module.css'

export function FileUploadButton({
  isDisabled,
}: {
  isDisabled?: boolean
}) {
  const { processAndLimitFiles } = useFileContext()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [currentAccept, setCurrentAccept] = useState('')

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files && Array.from(e.target.files)
      if (!files) return
      processAndLimitFiles(files)
      // Reset the input value to allow selecting the same file again
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    },
    [processAndLimitFiles]
  )

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isDisabled) return
    setIsDropdownOpen(!isDropdownOpen)
  }

  const handleSelectFileType = (fileType: FileType) => {
    setCurrentAccept(fileType.accept)
    setIsDropdownOpen(false)
    // Trigger file input click after a short delay to ensure dropdown closes
    setTimeout(() => {
      fileInputRef.current?.click()
    }, 100)
  }

  const handleCloseDropdown = () => {
    setIsDropdownOpen(false)
  }

  return (
    <div className={css.container}>
      <input
        ref={fileInputRef}
        hidden
        type='file'
        multiple
        onClick={(event) => event.stopPropagation()}
        accept={currentAccept}
        onChange={handleFileChange}
      />

      <button
        ref={buttonRef}
        aria-label='Add Files'
        className={clsx(css.buttonWrapper, 'relative')}
        onClick={handleClick}
        type='button'
      >
        <TooltipDefault text='Add Files'>
          <div
            className={clsx(css.button, {
              [css.isDisabled]: isDisabled,
            })}
          >
            <IconPlus width={20} height={20} className={css.icon} />
          </div>
        </TooltipDefault>
      </button>

      <FileTypeDropdown
        isOpen={isDropdownOpen}
        onSelect={handleSelectFileType}
        onClose={handleCloseDropdown}
        buttonRef={buttonRef}
      />
    </div>
  )
}


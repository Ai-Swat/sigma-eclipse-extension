import { useRef, useEffect, useState } from 'react'
import styles from './FileTypeDropdown.module.css'

export type FileTypeOption = 'text' | 'pdf'

export interface FileType {
  id: FileTypeOption
  name: string
  accept: string
}

export const FILE_TYPES: FileType[] = [
  {
    id: 'text',
    name: 'Text File',
    accept: 'text/plain,.txt,.doc,.docx,.xlsx,.xls,.csv,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,text/csv',
  },
  {
    id: 'pdf',
    name: 'PDF File',
    accept: 'application/pdf,.pdf',
  },
]

interface FileTypeDropdownProps {
  isOpen: boolean
  onSelect: (fileType: FileType) => void
  onClose: () => void
  buttonRef: React.RefObject<HTMLButtonElement>
}

export default function FileTypeDropdown({ isOpen, onSelect, onClose, buttonRef }: FileTypeDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null)
  const [position, setPosition] = useState({ top: 0, left: 0 })

  // Calculate dropdown position based on button position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const buttonRect = buttonRef.current.getBoundingClientRect()
      const dropdownHeight = 120 // approximate height
      
      setPosition({
        top: buttonRect.top - dropdownHeight - 8,
        left: buttonRect.left,
      })
    }
  }, [isOpen, buttonRef])

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const isClickOnButton = buttonRef.current && buttonRef.current.contains(event.target as Node)
      const isClickOnDropdown = dropdownRef.current && dropdownRef.current.contains(event.target as Node)
      
      if (!isClickOnButton && !isClickOnDropdown) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose, buttonRef])

  const handleSelectType = (fileType: FileType) => {
    onSelect(fileType)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div 
      className={styles.dropdown} 
      ref={dropdownRef} 
      onKeyDown={handleKeyDown}
      style={{ top: `${position.top}px`, left: `${position.left}px` }}
    >
      <div className={styles.fileTypeList}>
        {FILE_TYPES.map(fileType => (
          <button
            key={fileType.id}
            className={styles.fileTypeItem}
            onClick={() => handleSelectType(fileType)}
          >
            <span className={styles.fileTypeName}>{fileType.name}</span>
          </button>
        ))}
      </div>
    </div>
  )
}


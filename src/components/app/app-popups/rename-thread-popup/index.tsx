import { useEffect, useRef, useState, useCallback, memo } from 'react'
import cn from 'clsx'
import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'
import { Popup, PopupProps } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import { TextInput } from 'src/components/ui/text-input'
import css from './styles.module.css'

const RenameThreadPopup = memo(function RenameThreadPopup({
  visible,
  onClose,
  itemId,
  itemName,
}: PopupProps & { itemId: string; itemName: string }) {
  const [newName, setNewName] = useState(itemName)
  const inputRef = useRef<HTMLInputElement | null>(null)
  const isExtension = useSettingsStore((state) => state.isExtension)
  const renameUserThread = useSearchStore((state) => state.renameUserThread)

  const handleRenameThread = useCallback(() => {
    if (!newName || !newName.trim()) return
    renameUserThread(itemId, newName)
    onClose()
  }, [newName, itemId, renameUserThread, onClose])

  useEffect(() => {
    if (!visible) return

    setNewName(itemName)

    const timer = setTimeout(() => {
      inputRef.current?.focus()
      inputRef.current?.select()
    }, 0)

    return () => clearTimeout(timer)
  }, [visible, itemName])

  return (
    <Popup
      withCloseButton
      visible={visible}
      onClose={onClose}
      className={css.popup}
      title='Rename Thread'
    >
      <div
        className={cn('w-100p', { [css.contentWrapperExtension]: isExtension })}
      >
        {!isExtension && <div className={css.divider} />}
        <div className={css.column}>
          <TextInput
            ref={inputRef}
            value={newName}
            onChange={setNewName}
            placeholder={itemName}
            onEnter={handleRenameThread}
            name='rename-thread'
          />
          <div className={css.buttons}>
            <BaseButton color='grey' onClick={onClose}>
              Cancel
            </BaseButton>
            <BaseButton color='black' onClick={handleRenameThread}>
              Save
            </BaseButton>
          </div>
        </div>
      </div>
    </Popup>
  )
})

export default RenameThreadPopup

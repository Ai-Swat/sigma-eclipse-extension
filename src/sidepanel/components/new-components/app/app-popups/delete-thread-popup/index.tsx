import { memo, useCallback } from 'react'
import cn from 'clsx'
import { Popup, PopupProps } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import { useSettingsStore } from 'src/store/settings'
import css from './styles.module.css'

const DeleteThreadPopup = memo(function DeleteThreadPopup({
  visible,
  onClose,
  onSubmit,
  title,
}: PopupProps & { onSubmit: () => void; title?: string }) {
  const isExtension = useSettingsStore((state) => state.isExtension)

  const handleDelete = useCallback(() => {
    onClose()
    onSubmit()
  }, [onClose, onSubmit])

  return (
    <Popup
      withCloseButton
      visible={visible}
      onClose={onClose}
      className={css.popup}
      title='Are you sure?'
    >
      <div
        className={cn('w-100p', { [css.contentWrapperExtension]: isExtension })}
      >
        {!isExtension && <div className={css.divider} />}
        <div className={css.column}>
          <div className={css.textBlock}>
            <div>This will delete</div>
            {title && <div>{title}</div>}
          </div>
          <div className={css.buttons}>
            <BaseButton color='grey' onClick={onClose}>
              Cancel
            </BaseButton>
            <BaseButton color='red' onClick={handleDelete}>
              Delete
            </BaseButton>
          </div>
        </div>
      </div>
    </Popup>
  )
})

export default DeleteThreadPopup

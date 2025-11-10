import { clsx } from 'clsx'
import { FollowUpType } from 'src/store/types'
import { DropdownItemType } from 'src/components/ui/dropdown'
import IconClear from 'src/images/clear-icon.svg?react'
import css from './styles.module.css'

export function SelectedModeButton({
  item,
  onDelete,
  isExtension,
}: {
  item?: DropdownItemType
  onDelete: () => void
  isExtension?: boolean
}) {
  const type = item?.value
  const Icon = item?.icon
  const isAuto = type === FollowUpType.AUTO

  if (!item || isAuto) return null

  return (
    <div className={clsx(css.button, 'opacity-animation')} onClick={onDelete}>
      <Icon width={20} height={20} />
      <div className={clsx(css.text, { [css.isExtension]: isExtension })}>
        {item.shortenedTitle}
      </div>
      <div className={css.clearButton}>
        <IconClear width={16} height={16} className={css.clearIcon} />
      </div>
    </div>
  )
}

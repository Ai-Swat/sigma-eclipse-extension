import { memo } from 'react'
import cn from 'clsx'
import { FollowUpType } from 'src/store/types'
import { DropdownItemType } from '../index'
import IconCheck from 'src/images/check-icon.svg?react'
import css from './styles.module.css'

export const DropdownItems = memo(
  ({
    items,
    activeItem,
    onOptionSelect,
    closeDropdown,
  }: {
    items: DropdownItemType[]
    activeItem: DropdownItemType
    onOptionSelect: (item: DropdownItemType) => void
    closeDropdown: () => void
  }) => {
    return (
      <>
        {items
          .filter((el) => el.value !== FollowUpType.DEEP_RESEARCH)
          .map((el) => {
            const Icon = el.icon
            return (
              <div
                key={el.title}
                className={cn(css.listItem, {
                  [css.active]: activeItem.value === el.value,
                })}
                onClick={(event) => {
                  event.preventDefault()
                  event.stopPropagation()
                  onOptionSelect(el)
                  closeDropdown()
                }}
              >
                <>
                  {el?.icon && <Icon width={20} height={20} />}
                  {el?.flag}
                  {el.title}

                  {activeItem.value === el.value && (
                    <IconCheck
                      width={18}
                      height={18}
                      className={css.iconCheck}
                    />
                  )}
                </>
              </div>
            )
          })}
      </>
    )
  }
)

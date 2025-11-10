import { memo } from 'react'
import clsx from 'clsx'
import { CURSOR_START_VALUE } from 'src/components/app/smart-textarea/hooks/use-textarea-suggestions'
import StocksIcon from 'src/images/stocks.svg?react'
import SuggestionOptionHighlight from 'src/components/app/smart-textarea/components/textarea-options-list/suggestion-option-highlight'
import { Option } from 'src/components/app/smart-textarea/hooks/utils'
import css from './styles.module.css'

type TextareaOptionProps = {
  value: string
  index: number
  cursor: number
  option: Option
  selectOption: (option: Option) => void
  setPreselected: (index: number) => void
  isLast: boolean
  selectedMode?: string
}

export const TextareaOption = memo(
  ({
    option,
    index,
    cursor,
    selectOption,
    setPreselected,
    value,
    isLast,
    selectedMode,
  }: TextareaOptionProps) => {
    const isWebSearch = selectedMode === 'web-search'
    const isPreselected = index === cursor
    return (
      <>
        <div
          className={clsx(css.option, {
            [css.highlighted]: isPreselected,
          })}
          onClick={() => selectOption(option)}
          onMouseMove={() => {
            if (!isPreselected) {
              setPreselected(index)
            }
          }}
          onMouseLeave={() => {
            if (isPreselected) {
              setPreselected(CURSOR_START_VALUE)
            }
          }}
        >
          <div className={css.optionContent}>
            {isWebSearch && (
              <StocksIcon width={24} height={24} className={css.icon} />
            )}

            <SuggestionOptionHighlight
              text={option.label}
              searchValue={value}
            />
          </div>
        </div>

        {!isLast && <div className={css.divider} />}
      </>
    )
  }
)

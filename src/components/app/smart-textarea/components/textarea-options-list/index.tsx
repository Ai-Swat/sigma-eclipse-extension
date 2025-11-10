import { memo, useMemo } from 'react'
import { Option } from 'src/components/app/smart-textarea/hooks/utils'
import { TextareaOption } from './textarea-option'

interface TextareaOptionsListProps {
  cursor: number
  options: Option[]
  selectOption: (option: Option) => void
  setPreselected: (index: number) => void
  value: string
  selectedMode?: string
}

const TextareaOptionsList = memo(
  ({
    cursor,
    options,
    selectOption,
    setPreselected,
    value,
    selectedMode,
  }: TextareaOptionsListProps) => {
    const stabilizedOptions = useMemo(() => options, [options])

    if (!stabilizedOptions.length) return null

    return (
      <>
        {stabilizedOptions.map((option, index) => (
          <TextareaOption
            key={`${option.label}`}
            option={option}
            index={index}
            cursor={cursor}
            selectOption={selectOption}
            setPreselected={setPreselected}
            value={value}
            isLast={index + 1 === stabilizedOptions?.length}
            selectedMode={selectedMode}
          />
        ))}
      </>
    )
  }
)

export default TextareaOptionsList

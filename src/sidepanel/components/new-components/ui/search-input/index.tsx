import {
  ChangeEvent,
  InputHTMLAttributes,
  ReactElement,
  KeyboardEvent,
} from 'react'
import { useEvent } from 'src/libs/use/use-event'
import cn from 'clsx'
import MagnifierIcon from 'src/images/magnifier.svg?react'

import styles from './styles.module.css'

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange?: (str: string) => void
  onEnter?: () => void
  isVisibleError?: boolean
  inputClassName?: string
}

export function SearchInput(props: InputProps): ReactElement<HTMLInputElement> {
  const {
    onChange,
    className,
    inputClassName,
    value,
    onEnter,
    disabled,
    ...otherProps
  } = props

  const onChangeInput = useEvent((e: ChangeEvent<HTMLInputElement>) => {
    onChange?.(e.target.value)
  })

  const onKeyDownInput = useEvent((e: KeyboardEvent<HTMLInputElement>) => {
    if (e.code === 'Enter' && onEnter) {
      onEnter()
    }
  })

  const wrapperStyle = cn(styles.wrapper, className)

  const inputStyle = cn(styles.input, inputClassName)

  return (
    <div className={wrapperStyle}>
      <MagnifierIcon width={18} height={18} className={styles.searchIcon} />

      <input
        type='text'
        spellCheck='false'
        name='search-input'
        placeholder={otherProps?.placeholder || ''}
        onKeyDown={onKeyDownInput}
        onChange={onChangeInput}
        disabled={disabled}
        className={inputStyle}
        value={value}
        {...otherProps}
      />
    </div>
  )
}

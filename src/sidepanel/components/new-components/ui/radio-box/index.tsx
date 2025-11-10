import { ReactNode } from 'react'
import { useEvent } from 'src/libs/use/use-event'
import cn from 'clsx'
import styles from './styles.module.css'

interface Props {
  className?: string
  onChange: (value: any) => void
  children?: ReactNode
  checked: boolean
  isDisabled?: boolean
  name: string
  value: any
  color?: 'white'
}

export const RadioBox = (props: Props) => {
  const {
    className,
    name,
    checked,
    value,
    onChange,
    isDisabled,
    color,
    ...otherProps
  } = props

  const handleChange = useEvent(() => {
    if (onChange) {
      onChange(value)
    }
  })

  return (
    <label
      onChange={handleChange}
      className={cn(styles.wrapper, className, color && styles[color])}
      tabIndex={0}
    >
      <input
        type='radio'
        disabled={isDisabled}
        name={name}
        onChange={handleChange}
        {...otherProps}
      />
      <div
        className={cn([
          styles.icon,
          {
            [styles.iconDisabled]: isDisabled,
            [styles.iconChecked]: checked,
            [styles.iconCheckedWhite]: checked && color === 'white',
          },
        ])}
      >
        {checked && (
          <div
            className={cn(styles.dot, color && styles[color], {
              [styles.dotDisabled]: isDisabled,
            })}
          />
        )}
      </div>
    </label>
  )
}

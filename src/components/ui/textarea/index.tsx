import {
  ChangeEvent,
  Dispatch,
  TextareaHTMLAttributes,
  SetStateAction,
  KeyboardEvent,
  forwardRef,
  useRef,
} from 'react'
import clsx from 'clsx'

import { useEvent } from 'src/libs/use/use-event'
import { mergeRefs } from 'src/libs/merge-refs'

import styles from './styles.module.css'
// Removed useVirtualKeyboardStore - simplified for extension
import useMobileOs from 'src/libs/use/use-mobile-os'

type TextareaProps = Omit<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  'onChange'
> & {
  onChange?: Dispatch<SetStateAction<string>>
  onEnter?: Dispatch<SetStateAction<void>>
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props, ref) => {
    const innerRef = useRef<HTMLTextAreaElement>()
    const { onChange, className, onEnter, ...otherProps } = props

    const { isMobile } = useMobileOs()

    // Simplified stubs for extension
    const setOpen = () => {}
    const setClose = () => {}

    const onChangeInput = useEvent((e: ChangeEvent<HTMLTextAreaElement>) => {
      if (onChange) {
        onChange(e.target.value)
      }
    })

    const onKeyDownInput = useEvent((e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && onEnter && !e.shiftKey) {
        e.preventDefault()

        onEnter()
        return false
      }
    })

    return (
      <textarea
        ref={mergeRefs([ref, innerRef])}
        onChange={onChangeInput}
        onKeyDown={onKeyDownInput}
        {...otherProps}
        className={clsx(styles.textarea, className)}
        onBlur={(e) => {
          isMobile && setClose()
          otherProps.onBlur?.(e)
        }}
        onFocus={(e) => {
          isMobile && setOpen()
          otherProps.onFocus?.(e)
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )
        }}
      />
    )
  }
)

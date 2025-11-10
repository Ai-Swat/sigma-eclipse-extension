import {
  ChangeEvent,
  InputHTMLAttributes,
  KeyboardEvent,
  forwardRef,
} from 'react';
import cn from 'clsx';
import { useEvent } from 'src/libs/use/use-event';
import styles from 'src/components/ui/text-input/styles.module.css';

export type InputProps = Omit<
  InputHTMLAttributes<HTMLInputElement>,
  'onChange'
> & {
  onChange?: (str: string) => void;
  onEnter?: () => void;
  inputClassName?: string;
  isVisibleError?: boolean;
  textError?: string;
};

export const TextInput = forwardRef<HTMLInputElement, InputProps>(
  (props, ref) => {
    const {
      onChange,
      className,
      inputClassName,
      value,
      onEnter,
      disabled,
      isVisibleError,
      textError,
      ...otherProps
    } = props;

    const onChangeInput = useEvent((e: ChangeEvent<HTMLInputElement>) => {
      onChange?.(e.target.value);
    });

    const onKeyDownInput = useEvent((e: KeyboardEvent<HTMLInputElement>) => {
      if (e.code === 'Enter' && onEnter) {
        onEnter();
      }
    });

    const wrapperStyle = cn(styles.wrapper, className);

    const inputStyle = cn(styles.input, inputClassName, {
      [styles.isError]: isVisibleError,
    });

    return (
      <div className={wrapperStyle}>
        <input
          type='text'
          ref={ref}
          spellCheck='false'
          placeholder={otherProps?.placeholder || ''}
          onKeyDown={onKeyDownInput}
          onChange={onChangeInput}
          disabled={disabled}
          className={inputStyle}
          value={value}
          {...otherProps}
        />

        {isVisibleError && <div className={styles.error}>{textError}</div>}
      </div>
    );
  }
);

TextInput.displayName = 'TextInput';


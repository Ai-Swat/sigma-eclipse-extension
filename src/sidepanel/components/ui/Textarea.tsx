import { ChangeEvent, TextareaHTMLAttributes, KeyboardEvent, forwardRef, useRef } from 'react';
import clsx from 'clsx';

import { useEvent } from 'src/libs/use/use-event';
import { mergeRefs } from 'src/libs/merge-refs';

import styles from 'src/components/ui/textarea/styles.module.css';

type TextareaProps = Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> & {
  onChange?: (value: string) => void;
  onEnter?: () => void;
};

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>((props, ref) => {
  const innerRef = useRef<HTMLTextAreaElement>(null);
  const { onChange, className, onEnter, ...otherProps } = props;

  const onChangeInput = useEvent((e: ChangeEvent<HTMLTextAreaElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
  });

  const onKeyDownInput = useEvent((e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && onEnter && !e.shiftKey) {
      e.preventDefault();
      onEnter();
      return false;
    }
  });

  return (
    <textarea
      ref={mergeRefs([ref, innerRef])}
      onChange={onChangeInput}
      onKeyDown={onKeyDownInput}
      {...otherProps}
      className={clsx(styles.textarea, className)}
    />
  );
});

Textarea.displayName = 'Textarea';

import { Dispatch, ReactNode, SetStateAction, KeyboardEvent } from 'react';
import { useEvent } from 'src/libs/use/use-event';
import cn from 'clsx';
import styles from './styles.module.css';

type ComponentProps = {
  className?: string;
  onChange: Dispatch<SetStateAction<boolean>>;
  children?: ReactNode;
  checked?: boolean;
  disabled?: boolean;
};

export const CheckboxToggle = (props: ComponentProps) => {
  const { className, children, onChange, disabled, ...otherProps } = props;

  const handleChange = useEvent((event: KeyboardEvent<HTMLLabelElement>) => {
    if (event.key === ' ' || event.key === 'Enter') {
      onChange(!otherProps.checked);
    }
  });

  return (
    <label className={cn(styles.wrapper, className)} tabIndex={0} onKeyUp={handleChange}>
      <input
        disabled={disabled}
        type="checkbox"
        onChange={event => onChange(event.target.checked)}
        {...otherProps}
      />
      <span className={styles.icon}>
        <span className={styles.tumbler} />
      </span>
      {children && <span>{children}</span>}
    </label>
  );
};

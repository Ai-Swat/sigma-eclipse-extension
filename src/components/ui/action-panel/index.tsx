import { PropsWithChildren, ReactElement } from 'react'
import * as Popover from '@radix-ui/react-popover'
import cn from 'clsx'

import styles from './styles.module.css'

interface Props extends PropsWithChildren {
  className?: string
  trigger: ReactElement
  open?: boolean
  onOpenChange?: ((open: boolean) => void) | undefined
  side?: 'bottom' | 'top' | 'right' | 'left' | undefined
  align?: 'center' | 'start' | 'end' | undefined
  sideOffset?: number
  alignOffset?: number
}

export function ActionPanel({
  children,
  className,
  trigger,
  open,
  onOpenChange,
  side,
  align,
  sideOffset,
  alignOffset,
}: Props) {
  return (
    <Popover.Root open={open} onOpenChange={onOpenChange}>
      <Popover.Trigger asChild>{trigger}</Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          side={side || 'bottom'}
          align={align || 'start'}
          alignOffset={alignOffset || 0}
          sideOffset={sideOffset || 10}
          className={cn(styles.actionPanel, className)}
          autoFocus={false}
        >
          {children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

export function ActionPanelItem({
  children,
  onClick,
  id,
  className,
}: PropsWithChildren & {
  onClick?: (e?: any) => void
  id?: string
  className?: string
}) {
  return (
    <div
      onClick={onClick}
      id={id}
      className={cn(styles.actionItem, 'ignore-click-outside', className)}
    >
      {children}
    </div>
  )
}

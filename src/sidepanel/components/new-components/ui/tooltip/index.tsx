import { PropsWithChildren, useId } from 'react'
import cn from 'clsx'
import {
  Provider,
  Root,
  Trigger,
  Portal,
  Content,
  Arrow,
} from '@radix-ui/react-tooltip'
import { useSettingsStore } from 'src/store/settings'

import styles from './styles.module.css'

export function TooltipDefault({
  children,
  text,
  isShow,
  delayShow = 500,
  side,
}: PropsWithChildren & {
  text?: string
  isShow?: boolean
  delayShow?: number
  side?: 'bottom' | 'top' | 'right' | 'left'
}) {
  const id = useId()
  const isExtension = useSettingsStore((state) => state.isExtension)

  if (!text) return children

  return (
    <Provider delayDuration={delayShow}>
      <Root open={isShow}>
        <Trigger asChild>{children}</Trigger>
        <Portal key={id}>
          <Content
            side={side || 'bottom'}
            align='center'
            className={cn(styles.tooltip, {
              [styles.isExtension]: isExtension,
            })}
            sideOffset={5}
          >
            {text}
            <Arrow className={styles.tooltipArrow} />
          </Content>
        </Portal>
      </Root>
    </Provider>
  )
}

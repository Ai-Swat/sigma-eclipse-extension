import React, { memo } from 'react'
import ArrowUpIcon from 'src/images/chevron.svg?react'
import cn from 'clsx'
import { TooltipDefault } from 'src/components/ui/tooltip'
import RefreshIcon from 'src/images/arrow-refresh.svg?react'
import css from './styles.module.css'

type DropdownButtonProps = {
  buttonText: string
  ActiveItemIcon?: any
  activeItemFlag?: React.ReactNode
  isExtendingTitle?: boolean
  isOpen: boolean
  isOpenTooltip: boolean
  isOpenTitle: boolean
  spanWidth: string
  measureRef: React.RefObject<HTMLSpanElement>
  triggerRef: React.RefObject<HTMLDivElement>
  handleMouseEnter: () => void
  handleMouseLeave: () => void
  handleOpenDropdown: (e: React.MouseEvent<HTMLDivElement>) => void
  isTransparent?: boolean
  tooltipTitle?: string
  isDisabled?: boolean
}

export const DropdownButton = memo(
  ({
    buttonText,
    ActiveItemIcon,
    activeItemFlag,
    isExtendingTitle,
    isOpen,
    isOpenTooltip,
    isOpenTitle,
    spanWidth,
    measureRef,
    triggerRef,
    handleMouseEnter,
    handleMouseLeave,
    handleOpenDropdown,
    isTransparent,
    tooltipTitle,
    isDisabled,
  }: DropdownButtonProps) => {
    return (
      <TooltipDefault
        text={tooltipTitle}
        isShow={tooltipTitle !== undefined && isOpenTooltip}
      >
        <div
          ref={triggerRef}
          className={cn(css.wrapper, {
            [css.isExtendingTitle]: isExtendingTitle,
            [css.isTransparent]: isTransparent,
            [css.isOpen]: isOpen,
            [css.isDisabled]: isDisabled,
          })}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={handleOpenDropdown}
        >
          <div className={css.row}>
            {isExtendingTitle ? (
              <>
                <RefreshIcon className={css.icon} />
                {(isOpenTitle || isOpen) && (
                  <div className={css.hiddenTitle}>{buttonText}</div>
                )}
              </>
            ) : (
              <>
                {ActiveItemIcon && (
                  <ActiveItemIcon
                    width={24}
                    height={24}
                    className={css.stroke}
                  />
                )}
                {activeItemFlag}
                <div className={css.spanWrapper}>
                  <span ref={measureRef} className={css.ghostSpan}>
                    {buttonText}
                  </span>
                  <span
                    className={css.animatedSpan}
                    style={{ width: spanWidth }}
                  >
                    {buttonText}
                  </span>
                </div>
              </>
            )}
          </div>

          <ArrowUpIcon
            width={16}
            height={16}
            className={cn(css.iconArrow, { [css.iconRotate]: isOpen })}
          />
        </div>
      </TooltipDefault>
    )
  }
)

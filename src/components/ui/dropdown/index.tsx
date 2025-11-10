import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import loadable from '@loadable/component'
import cn from 'clsx'
import { FollowUpType } from 'src/store/types'
import useClickOutside from 'src/libs/use/use-click-outside'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { useSettingsStore } from 'src/store/settings'
import { DropdownItems } from './dropdown-items'
import { DropdownButton } from './dropdown-button'
import css from './styles.module.css'

const BottomSheet = loadable(() => import('src/components/ui/bottom-sheet'))

export type DropdownItemType = {
  title: string
  shortenedTitle?: string
  value: FollowUpType
  icon?: any
  flag?: any
}

interface IProps {
  title?: string
  items: DropdownItemType[]
  activeItem: DropdownItemType
  onOptionSelect: (item: DropdownItemType) => void
  isExtendingTitle?: boolean
  isNoDesktopTitle?: boolean
  isTransparent?: boolean
  tooltipTitle?: string
  side?: 'top' | 'bottom'
  isDisabled?: boolean
  isOverlayBlocker?: boolean
}

function Dropdown({
  title,
  items,
  onOptionSelect,
  activeItem,
  isExtendingTitle,
  isNoDesktopTitle,
  isTransparent,
  tooltipTitle,
  side,
  isDisabled,
  isOverlayBlocker = true,
}: IProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenTooltip, setIsOpenTooltip] = useState(false)
  const [isOpenTitle, setIsOpenTitle] = useState(false)
  const [openUpward, setOpenUpward] = useState(false)
  const [spanWidth, setSpanWidth] = useState<string>('auto')

  const innerRef = useRef<HTMLDivElement | null>(null)
  const triggerRef = useRef<HTMLDivElement | null>(null)
  const measureRef = useRef<HTMLSpanElement>(null)
  const isMobile = useMobileDetect()

  const isDeepResearch = activeItem.value === FollowUpType.DEEP_RESEARCH
  const buttonText = isDeepResearch ? items[0].title : activeItem?.title
  const ActiveItemIcon = isDeepResearch ? items[0].icon : activeItem?.icon

  const isExtension = useSettingsStore((state) => state.isExtension)
  const isDropdown = isOpen && !isMobile && !isExtension
  const isBottomSheet = isOpen && (isMobile || isExtension)

  const closeDropdown = useCallback(() => setIsOpen(false), [])

  useClickOutside(innerRef, closeDropdown)

  useEffect(() => {
    if (measureRef.current) {
      const width = measureRef.current.offsetWidth
      setSpanWidth(width > 0 ? `${width + 1}px` : 'auto')
    }
  }, [buttonText])

  useEffect(() => {
    return () => {
      if (clearTooltipTimers.current.tooltip) {
        clearTimeout(clearTooltipTimers.current.tooltip)
      }
      if (clearTooltipTimers.current.title) {
        clearTimeout(clearTooltipTimers.current.title)
      }
    }
  }, [])

  const handleToggle = useCallback(() => {
    if (!isOpen) {
      if (side === 'top') setOpenUpward(true)
      else if (side === 'bottom') setOpenUpward(false)
      else if (triggerRef.current) {
        const DROPDOWN_HEIGHT = 250
        const triggerRect = triggerRef.current.getBoundingClientRect()
        const spaceBelow = window.innerHeight - triggerRect.bottom
        const spaceAbove = triggerRect.top

        setOpenUpward(
          spaceBelow < DROPDOWN_HEIGHT && spaceAbove > DROPDOWN_HEIGHT
        )
      }
      setIsOpen(true)
    } else setIsOpen(false)
  }, [isOpen, side])

  const clearTooltipTimers = useRef<{
    tooltip?: NodeJS.Timeout
    title?: NodeJS.Timeout
  }>({})

  const handleMouseEnter = useCallback(() => {
    clearTimeout(clearTooltipTimers.current.tooltip)
    clearTimeout(clearTooltipTimers.current.title)

    setIsOpenTitle(true)
    if (!isOpen) {
      clearTooltipTimers.current.tooltip = setTimeout(() => {
        if (!isOpen) setIsOpenTooltip(true)
      }, 500)
    }
  }, [isOpen])

  const handleMouseLeave = useCallback(() => {
    clearTimeout(clearTooltipTimers.current.tooltip)
    clearTimeout(clearTooltipTimers.current.title)

    setIsOpenTooltip(false)
    clearTooltipTimers.current.title = setTimeout(() => {
      setIsOpenTitle(false)
    }, 200)
  }, [])

  const handleOpenDropdown = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      e.preventDefault()
      e.stopPropagation()

      if (isDisabled) {
        return
      }

      if (clearTooltipTimers.current.tooltip)
        clearTimeout(clearTooltipTimers.current.tooltip)
      if (clearTooltipTimers.current.title)
        clearTimeout(clearTooltipTimers.current.title)
      setIsOpenTooltip(false)
      handleToggle()
    },
    [handleToggle, isDisabled]
  )

  const listWrapperClass = useMemo(
    () =>
      cn(css.listWrapper, {
        [css.openDown]: side === 'bottom' || !openUpward,
        [css.openTop]: side === 'top' || openUpward,
      }),
    [side, openUpward]
  )

  return (
    <div className='relative' ref={innerRef}>
      <DropdownButton
        buttonText={buttonText}
        ActiveItemIcon={ActiveItemIcon}
        activeItemFlag={activeItem?.flag}
        isExtendingTitle={isExtendingTitle}
        isOpen={isOpen}
        isOpenTooltip={isOpenTooltip}
        isOpenTitle={isOpenTitle}
        spanWidth={spanWidth}
        measureRef={measureRef}
        triggerRef={triggerRef}
        handleMouseEnter={handleMouseEnter}
        handleMouseLeave={handleMouseLeave}
        handleOpenDropdown={handleOpenDropdown}
        isTransparent={isTransparent}
        tooltipTitle={tooltipTitle}
        isDisabled={isDisabled}
      />

      {isDropdown && (
        <>
          {isOverlayBlocker && (
            <div className='overlay-blocker' onClick={closeDropdown} />
          )}

          <div className={listWrapperClass}>
            {title && !isNoDesktopTitle && (
              <div className={css.title}>{title}</div>
            )}
            <DropdownItems
              items={items}
              activeItem={activeItem}
              onOptionSelect={onOptionSelect}
              closeDropdown={closeDropdown}
            />
          </div>
        </>
      )}

      {isBottomSheet && (
        <BottomSheet
          visible={isOpen}
          onClose={closeDropdown}
          title={title}
          className={'ignore-click-outside'}
        >
          <div className={cn(css.listContent, 'ignore-click-outside')}>
            <DropdownItems
              items={items}
              activeItem={activeItem}
              onOptionSelect={onOptionSelect}
              closeDropdown={closeDropdown}
            />
          </div>
        </BottomSheet>
      )}
    </div>
  )
}

export default Dropdown

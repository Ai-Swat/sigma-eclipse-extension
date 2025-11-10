import React, { ReactElement, useCallback, useRef, useState } from 'react'
import { clsx } from 'clsx'

import { useSettingsStore } from 'src/store/settings'
import { FollowUpType } from 'src/store/types'
import { useFileContext } from 'src/contexts/fileContext'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { ACCEPTS } from 'src/components/app/drag-n-drop-wrapper/constants'

import { TooltipDefault } from 'src/components/ui/tooltip'
import { ActionPanel, ActionPanelItem } from 'src/components/ui/action-panel'
import { DropdownItemType } from 'src/components/ui/dropdown'
import { ClipButton } from '../clip-button'
import IconPlus from 'src/images/plus.svg?react'
import DotIcon from 'src/images/dots.svg?react'
import IconCheck from 'src/images/check-icon.svg?react'
import IconClear from 'src/images/clear-icon.svg?react'
import ArrowUpIcon from 'src/images/chevron.svg?react'

import { searchDropdownItems, searchDropdownItemsExtension } from './utils'
import css from './styles.module.css'

const SelectableActionPanelItem = ({
  item,
  activeItem,
  onSelect,
  handleClose,
}: {
  item: DropdownItemType
  activeItem?: DropdownItemType
  onSelect: (item: DropdownItemType) => void
  handleClose: () => void
}) => {
  const Icon = item.icon
  const isSelected = activeItem?.value === item.value
  return (
    <ActionPanelItem
      key={item.value}
      className={clsx(css.actionPanelItem, 'ignore-click-outside', {
        [css.selected]: isSelected,
      })}
      onClick={(event) => {
        event.stopPropagation()
        event.preventDefault()
        handleClose()
        onSelect(item)
      }}
    >
      <Icon width={20} height={20} className={css.iconPrimary} />
      <div className={css.innerRow}>
        {item.title}
        {isSelected && (
          <>
            <IconCheck width={18} height={18} className={css.iconCheck} />
            <IconClear width={18} height={18} className={css.iconClear} />
          </>
        )}
      </div>
    </ActionPanelItem>
  )
}

const FileUploadItem = ({
  fileInputRef,
  onClose,
}: {
  fileInputRef: React.RefObject<HTMLInputElement>
  onClose: () => void
}) => (
  <ActionPanelItem className={css.actionPanelItem}>
    <ClipButton fileInputRef={fileInputRef} onClose={onClose} />
  </ActionPanelItem>
)

const DropdownActionPanel = ({
  open,
  setOpen,
  items,
  itemsMore,
  activeItem,
  onSelect,
  fileInputRef,
  trigger,
}: {
  open: boolean
  setOpen: (open: boolean) => void
  items: DropdownItemType[]
  itemsMore?: DropdownItemType[]
  activeItem?: DropdownItemType
  onSelect: (item: DropdownItemType) => void
  fileInputRef: React.RefObject<HTMLInputElement>
  trigger: ReactElement
}) => {
  const [isOpenMore, setOpenMore] = useState(false)
  const isMobile = useMobileDetect()
  const isWidget = useSettingsStore((state) => state.isWidget)

  return (
    <ActionPanel
      open={open}
      onOpenChange={setOpen}
      side='bottom'
      align='start'
      sideOffset={4}
      className={css.wrapperActionPanel}
      trigger={trigger}
    >
      {!isWidget && (
        <>
          <div className={css.listWrapper}>
            <FileUploadItem
              fileInputRef={fileInputRef}
              onClose={() => setOpen(false)}
            />
          </div>
          <div className={css.divider} />
        </>
      )}

      <div className={css.listWrapper}>
        {items.map((item) => (
          <SelectableActionPanelItem
            key={item.value}
            item={item}
            activeItem={activeItem}
            onSelect={onSelect}
            handleClose={() => setOpen(false)}
          />
        ))}

        {itemsMore && itemsMore.length > 0 && (
          <MoreDropdownPanel
            isOpen={isOpenMore}
            setOpen={setOpenMore}
            items={itemsMore}
            activeItem={activeItem}
            onSelect={onSelect}
            isMobile={isMobile}
            handleClose={() => setOpen(false)}
          />
        )}
      </div>
    </ActionPanel>
  )
}

const MoreDropdownPanel = ({
  isOpen,
  setOpen,
  items,
  activeItem,
  onSelect,
  isMobile,
  handleClose,
}: {
  isOpen: boolean
  setOpen: (open: boolean) => void
  items: DropdownItemType[]
  activeItem?: DropdownItemType
  onSelect: (item: DropdownItemType) => void
  isMobile: boolean
  handleClose: () => void
}) => (
  <ActionPanel
    open={isOpen}
    onOpenChange={setOpen}
    side='right'
    align={isMobile ? 'end' : 'start'}
    alignOffset={isMobile ? -7 : 0}
    sideOffset={isMobile ? -60 : 6}
    className={clsx(css.wrapperActionPanel, css.wrapperActionPanelSmall)}
    trigger={
      <div className='relative ignore-click-outside'>
        <ActionPanelItem
          onClick={() => setOpen(true)}
          className={clsx(css.actionPanelItem, { [css.isOpen]: isOpen })}
        >
          <DotIcon width={20} height={20} className={css.iconPrimary} />
          <div className={css.innerRow}>
            More
            <ArrowUpIcon width={18} height={18} className={css.iconChevron} />
          </div>
        </ActionPanelItem>
      </div>
    }
  >
    <div className={css.listWrapper}>
      {items.map((el) => (
        <SelectableActionPanelItem
          key={el.value}
          item={el}
          activeItem={activeItem}
          onSelect={onSelect}
          handleClose={handleClose}
        />
      ))}
    </div>
  </ActionPanel>
)

export function ModeDropdown({
  activeSearchType,
  setActiveSearchType,
  isExtension,
  isDisabled,
}: {
  activeSearchType: DropdownItemType | undefined
  setActiveSearchType: (item: DropdownItemType) => void
  isExtension?: boolean
  isDisabled?: boolean
}) {
  const { processAndLimitFiles } = useFileContext()
  const [isOpen, setOpen] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files && Array.from(e.target.files)
      if (!files) return
      processAndLimitFiles(files)
    },
    [processAndLimitFiles]
  )

  const itemsExtension = searchDropdownItemsExtension.filter((el) =>
    [
      FollowUpType.WEB_AGENT,
      FollowUpType.DEEP_RESEARCH,
      FollowUpType.CHAT_EXTENSION,
    ].includes(el.value)
  )

  const items = searchDropdownItems.filter((el) =>
    [
      FollowUpType.SEARCH,
      FollowUpType.DEEP_RESEARCH,
      FollowUpType.IMAGE,
    ].includes(el.value)
  )

  const itemsMore = searchDropdownItems.filter((el) =>
    [
      FollowUpType.CHAT,
      FollowUpType.TEXT_GENERATOR,
      FollowUpType.TELEGRAM,
    ].includes(el.value)
  )

  const triggerButton = (
    <button
      aria-label='Add files and more'
      className={clsx(css.buttonWrapper, 'relative')}
      onClick={(event) => {
        event.stopPropagation()
        if (isDisabled) return

        setOpen(true)
      }}
    >
      <TooltipDefault text='Add files and more'>
        <div
          className={clsx(css.button, 'ignore-click-outside', {
            [css.active]: isOpen,
            [css.isDisabled]: isDisabled,
            [css.isExtension]: isExtension,
          })}
        >
          <IconPlus width={20} height={20} className={css.icon} />
        </div>
      </TooltipDefault>
    </button>
  )

  return (
    <>
      <input
        ref={fileInputRef}
        hidden
        type='file'
        multiple
        onClick={(event) => event.stopPropagation()}
        accept={ACCEPTS.join(', ')}
        onChange={handleFileChange}
      />

      {isExtension ? (
        <DropdownActionPanel
          open={isOpen}
          setOpen={setOpen}
          items={itemsExtension}
          activeItem={activeSearchType}
          onSelect={setActiveSearchType}
          fileInputRef={fileInputRef}
          trigger={triggerButton}
        />
      ) : (
        <DropdownActionPanel
          open={isOpen}
          setOpen={setOpen}
          items={items}
          itemsMore={itemsMore}
          activeItem={activeSearchType}
          onSelect={setActiveSearchType}
          fileInputRef={fileInputRef}
          trigger={triggerButton}
        />
      )}
    </>
  )
}

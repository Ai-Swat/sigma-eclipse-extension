import React, { memo, useCallback, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import loadable from '@loadable/component'

import { useSearchStore } from 'src/store'
import { UserHistoryItem } from 'src/store/types'
import { addToastSuccess } from 'src/libs/toast-messages'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { useClipboard } from 'src/libs/use/use-clipboard'
import { DEFAULT_TITLE, VITE_BASE_FRONT_URL } from 'src/config'

import { ActionPanel, ActionPanelItem } from 'src/components/ui/action-panel'
import { useSettingsStore } from 'src/store/settings'
import DotsIcon from 'src/images/dots.svg?react'
import ShareIcon from 'src/images/share-thread.svg?react'
import RenameIcon from 'src/images/rename.svg?react'
import DeleteIcon from 'src/images/delete.svg?react'

import styles from '../history-item/styles.module.css'
import css from './styles.module.css'

const BottomSheet = loadable(() => import('src/components/ui/bottom-sheet'))
const DeleteThreadPopup = loadable(
  () => import('src/components/app/app-popups/delete-thread-popup')
)

interface HistoryActionButtonProps {
  item: UserHistoryItem
  isHistoryPage?: boolean
  isSidebar?: boolean
  isOpen: boolean
  setIsOpen: (value: boolean) => void
  setRenamePopupVisible: (value: boolean) => void
}

function HistoryActionButtonComponent({
  isHistoryPage,
  isSidebar,
  item,
  isOpen,
  setIsOpen,
  setRenamePopupVisible,
}: HistoryActionButtonProps) {
  const deleteUserThread = useSearchStore((state) => state.deleteUserThread)
  const isExtension = useSettingsStore((state) => state.isExtension)

  const isMobile = useMobileDetect()
  const [copy] = useClipboard()
  const nav = useNavigate()
  const location = useLocation()

  const [isOpenDeletePopup, setOpenDeletePopup] = useState(false)

  const isActive = location?.search?.includes(item.hash)
  const url =
    typeof window !== 'undefined'
      ? `${VITE_BASE_FRONT_URL}/search?id=${item.hash}`
      : ''

  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen])

  const handleDeleteThread = useCallback(() => {
    // на главную если удаляем активный тред
    if (isActive) nav('/', { replace: true })
    deleteUserThread(item.id)
  }, [isActive, nav, deleteUserThread, item.id])

  const handleCopy = useCallback(() => {
    copy(url)
    addToastSuccess('Link Copied. Paste to share')
  }, [copy, url])

  const handleShare = useCallback(async () => {
    if (navigator?.share) {
      try {
        await navigator.share({ title: item.query, text: DEFAULT_TITLE, url })
      } catch (error) {
        // ...
      }
    } else handleCopy()
  }, [item.query, url, handleCopy])

  const handleShareThread = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      handleClose()

      if (isMobile && !isExtension) {
        void handleShare()
        return
      }
      handleCopy()
    },
    [handleClose, handleCopy, handleShare, isMobile, isExtension]
  )

  const handleRename = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      handleClose()
      setRenamePopupVisible(true)
    },
    [handleClose, setRenamePopupVisible]
  )

  const handleOpenDeletePopup = useCallback(
    (e: React.MouseEvent) => {
      e.stopPropagation()
      e.preventDefault()
      handleClose()
      setOpenDeletePopup(true)
    },
    [handleClose, setRenamePopupVisible]
  )

  const handleCloseDeletePopup = useCallback(
    () => setOpenDeletePopup(false),
    []
  )

  const content = (
    <>
      <ActionPanelItem onClick={handleShareThread}>
        <ShareIcon className={css.iconPanel} />
        Share
      </ActionPanelItem>
      <ActionPanelItem onClick={handleRename}>
        <RenameIcon className={css.iconPanelFill} />
        Rename
      </ActionPanelItem>
      <ActionPanelItem onClick={handleOpenDeletePopup}>
        <DeleteIcon className={css.iconPanelFill} />
        <span>Delete</span>
      </ActionPanelItem>
    </>
  )

  return (
    <>
      <DeleteThreadPopup
        visible={isOpenDeletePopup}
        onClose={handleCloseDeletePopup}
        onSubmit={handleDeleteThread}
        title={item.thread_name}
      />

      {(isMobile || isExtension) && (
        <>
          <div
            className={clsx(css.dotButton, css.dotButtonMobile, {
              [css.isHistoryPage]: isHistoryPage,
              [css.isSidebar]: isSidebar,
            })}
            onClick={(event) => {
              event.preventDefault()
              setIsOpen(true)
            }}
          >
            <DotsIcon
              width={20}
              height={20}
              className={clsx(css.icon, styles.hoveredIcon)}
            />
          </div>

          <BottomSheet
            visible={isOpen}
            onClose={handleClose}
            title={'Thread Actions'}
            className={'ignore-click-outside'}
          >
            <div className={'ignore-click-outside'}>{content}</div>
          </BottomSheet>
        </>
      )}

      {!isMobile && !isExtension && (
        <ActionPanel
          className={css.actionPanelHistory}
          open={isOpen}
          onOpenChange={setIsOpen}
          trigger={
            <div
              className={clsx(css.dotButton, {
                [css.isHistoryPage]: isHistoryPage,
                [css.isSidebar]: isSidebar,
                [css.isActiveButton]: isOpen,
              })}
              onClick={(event) => {
                event.stopPropagation()
                event.preventDefault()
                setIsOpen(true)
              }}
            >
              <DotsIcon
                width={20}
                height={20}
                className={clsx(css.icon, styles.hoveredIcon)}
              />
            </div>
          }
        >
          {content}
        </ActionPanel>
      )}
    </>
  )
}

export const HistoryActionButton = memo(HistoryActionButtonComponent)

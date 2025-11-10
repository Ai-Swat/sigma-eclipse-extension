import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import loadable from '@loadable/component'
import { clsx } from 'clsx'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { UserHistoryItem } from 'src/store/types'
import { stripMarkdown } from 'src/routes/history/utils'
import { HistoryActionButton } from '../history-action-button'

import css from './styles.module.css'

const RenameThreadPopup = loadable(
  () => import('src/components/app/app-popups/rename-thread-popup')
)

export default function HistorySidebarItem({
  item,
  onOpen,
}: {
  item: UserHistoryItem
  onOpen?: () => void
}) {
  const location = useLocation()
  const isActive = location.search?.includes(item.hash)
  const link = `/search?id=${item.hash}`
  const [isOpen, setIsOpen] = useState(false)
  const [isOpenRenamePopup, setOpenRenamePopup] = useState(false)
  const isMobile = useMobileDetect()

  return (
    <>
      <div
        className={clsx(css.wrapper, 'opacity-animation', {
          [css.isActive]: isActive,
          [css.isActiveMenu]: isOpen,
        })}
        onDoubleClick={() => {
          if (isMobile) return
          setOpenRenamePopup(true)
        }}
      >
        <Link to={link} onClick={onOpen} className={css.row}>
          <div className={css.text}>{stripMarkdown(item.thread_name)}</div>
        </Link>

        <div className={css.buttonWrapper}>
          <HistoryActionButton
            item={item}
            isOpen={isOpen}
            setIsOpen={setIsOpen}
            setRenamePopupVisible={setOpenRenamePopup}
            isSidebar
          />
        </div>
      </div>

      <RenameThreadPopup
        visible={isOpenRenamePopup}
        onClose={() => setOpenRenamePopup(false)}
        itemId={item.id}
        itemName={item.thread_name}
      />
    </>
  )
}

import { memo, useCallback, useEffect, useMemo, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { CSSTransition } from 'react-transition-group'
import { clsx } from 'clsx'
import { useShallow } from 'zustand/react/shallow'

import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'
import { useSidebarStore } from 'src/store/sidebar'
import { useOpenImprovementsStore } from 'src/store/improvements-open'
import { groupHistoryByDate } from 'src/libs/group-history-by-date'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { SEARCH_SCROLL_CONTAINER } from 'src/components/containers/layout'
import {
  TEXTAREA_FOLLOWUP_ID,
  TEXTAREA_ID_DESKTOP,
} from 'src/components/app/smart-textarea/hooks/utils'

import { Space } from 'src/components/ui/space'
import ActiveLink from './_components/active-link'
import OpenSidebarButton from './_components/open-sidebar-button'
import NewThreadButton from './_components/new-thread-button'
import HistorySidebarItem from './_components/history-item'
import { ProfileItem } from '../authentication-components/profile-item'
import HistoryIcon from 'src/images/history-sidebar.svg?react'
import NewThreadIcon from 'src/images/new-thread.svg?react'
// import LibraryIcon from 'src/images/library.svg?react'

import css from './styles.module.css'

export const Sidebar = memo(() => {
  const { is_log_in, user, userHistory } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
      userHistory: state.userHistory,
    }))
  )
  const { isWidget, isExtension } = useSettingsStore(
    useShallow((state) => ({
      isWidget: state.isWidget,
      isExtension: state.isExtension,
    }))
  )
  const { isOpenSidebar, closeSidebar } = useSidebarStore(
    useShallow((state) => ({
      isOpenSidebar: state.isOpenSidebar,
      closeSidebar: state.closeSidebar,
    }))
  )
  const { closeImprovements, isOpenImprovements } = useOpenImprovementsStore(
    useShallow((state) => ({
      closeImprovements: state.closeImprovements,
      isOpenImprovements: state.isOpenImprovements,
    }))
  )

  const nodeRef = useRef(null)
  const location = useLocation()
  const isMobile = useMobileDetect()
  const isLogIn = Boolean(is_log_in && user)

  const history = useMemo(
    () => (userHistory ? groupHistoryByDate(userHistory) : []),
    [userHistory]
  )

  const handleHideSidebarOnMobile = () => {
    if (isOpenImprovements || isMobile) {
      closeImprovements()
      closeSidebar()
    }
  }

  const handleFocusTextareaMainPage = useCallback(() => {
    const textarea =
      document.getElementById(TEXTAREA_ID_DESKTOP) ||
      document.getElementById(TEXTAREA_FOLLOWUP_ID)
    textarea?.focus()
  }, [])

  const handleCloseSidebarWithFocus = () => {
    handleHideSidebarOnMobile()
    handleFocusTextareaMainPage()
  }

  useEffect(() => {
    //   Когда маршрут изменился, закрываем Sidebar если нужно для мобилы
    if (isOpenSidebar) handleHideSidebarOnMobile()
  }, [location.pathname])

  // закрыть sidebar при выходе из аккаунта
  useEffect(() => {
    if (!isLogIn) closeSidebar()
  }, [isLogIn])

  // управление overflow при открытии sidebar
  useEffect(() => {
    const container = document.getElementById(SEARCH_SCROLL_CONTAINER)
    if (!container) return

    if (!isMobile) handleFocusTextareaMainPage()

    container.style.overflow = isOpenSidebar && isMobile ? 'hidden' : ''
    return () => {
      container.style.overflow = ''
    }
  }, [isOpenSidebar, isMobile])

  const historyBlock = useMemo(() => {
    if (!history?.length) {
      return <div className={css.emptyState}>No threads this week</div>
    }

    return (
      <>
        {history.map((group) => (
          <div key={group.title} className={css.historyWrapper}>
            <div className={css.title}>{group.title}</div>

            {group.history?.map((el) => (
              <HistorySidebarItem
                onOpen={handleHideSidebarOnMobile}
                item={el}
                key={el.id}
              />
            ))}
          </div>
        ))}
        <Space size={10} />
      </>
    )
  }, [history, handleHideSidebarOnMobile])

  const overlayClassName = useMemo(
    () =>
      clsx(css.overlay, {
        [css.overlayIsOpenImprovements]: isOpenImprovements,
      }),
    [isOpenImprovements]
  )

  if (!isLogIn || isWidget || isExtension) return null

  const transitionClasses = {
    enter: css.sidebarEnter,
    enterActive: css.sidebarEnterActive,
    exit: css.sidebarExit,
    exitActive: css.sidebarExitActive,
  }

  return (
    <>
      <CSSTransition
        in={isOpenSidebar}
        timeout={300}
        classNames={transitionClasses}
        unmountOnExit
        nodeRef={nodeRef}
      >
        <div ref={nodeRef} className={css.background}>
          <div className={css.wrapperSidebar}>
            <div className={css.mainBlock}>
              <div className={css.buttonsWrapper}>
                <NewThreadButton onOpen={handleCloseSidebarWithFocus} isLogo />

                <OpenSidebarButton />
              </div>

              <div className={css.linksWrapper}>
                <ActiveLink
                  title={'New Thread'}
                  url={'/'}
                  doNotShowSelection
                  onOpen={handleCloseSidebarWithFocus}
                  icon={<NewThreadIcon className={css.iconStroke} />}
                />

                {/*<ActiveLink*/}
                {/*  title={'Library'}*/}
                {/*  url={'/library'}*/}
                {/*  icon={<LibraryIcon className={css.icon} />}*/}
                {/*/>*/}

                <ActiveLink
                  title={'History'}
                  url={'/history'}
                  icon={<HistoryIcon className={css.icon} />}
                />
              </div>
            </div>
            <div className={css.divider} />
            <div className='customScrollBarVertical w-100p flex-1'>
              {historyBlock}
            </div>

            <div className={css.profileWrapper}>
              <ProfileItem isSidebar />
            </div>
          </div>
        </div>
      </CSSTransition>

      {isOpenSidebar && (
        <div className={overlayClassName} onClick={closeSidebar} />
      )}
    </>
  )
})

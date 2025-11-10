import { useCallback, useMemo } from 'react'
import cn from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { useShallow } from 'zustand/react/shallow'

import { UpgradePlanButton } from 'src/components/app/app-buttons/upgrade-plan-button'
import { Hydrated } from 'src/components/containers/hydrated'
import { ProfileItem } from 'src/components/app/authentication-components/profile-item'
import BaseButton from 'src/components/ui/base-button'
import NewThreadButton from 'src/components/app/sidebar/_components/new-thread-button'
import OpenSidebarButton from 'src/components/app/sidebar/_components/open-sidebar-button'
import MobileHeadIcon from 'src/images/mobile-head.svg?react'
import NewThreadIcon from 'src/images/new-thread.svg?react'

import { useSearchStore } from 'src/store'
import { TariffCode } from 'src/store/types'
import { useSidebarStore } from 'src/store/sidebar'
import { useSettingsStore } from 'src/store/settings'

import useStickyHeader from 'src/libs/use/use-sticky-header'
import { SEARCH_SCROLL_CONTAINER } from 'src/components/containers/layout'
import { TEXTAREA_ID_DESKTOP } from 'src/components/app/smart-textarea/hooks/utils'
import useMobileDetect from 'src/libs/use/use-mobile-detect'

import styles from './styles.module.css'

export function Header() {
  const { isOpenSidebar, toggleSidebar } = useSidebarStore(
    useShallow((state) => ({
      isOpenSidebar: state.isOpenSidebar,
      toggleSidebar: state.toggleSidebar,
    }))
  )
  const { isWidget } = useSettingsStore(
    useShallow((state) => ({
      isWidget: state.isWidget,
      isExtension: state.isExtension,
    }))
  )
  const { is_log_in, user } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
    }))
  )

  const location = useLocation()
  const isMobile = useMobileDetect()
  const { headerRef, isSticky } = useStickyHeader<HTMLDivElement>(
    SEARCH_SCROLL_CONTAINER
  )
  const isLogIn = Boolean(is_log_in && user)
  const isHistoryPage = location.pathname === '/history'
  const isMain = location.pathname === '/'
  const isNoBorderBottom = isHistoryPage || isMain
  const alwaysVisiblePages = ['/history'] // список страниц где всегда sticky header
  const isAlwaysVisible = alwaysVisiblePages.includes(location.pathname)

  const isShowUpgradePlanButton = useMemo(() => {
    return Boolean(
      isLogIn &&
        user?.subscription &&
        (user?.subscription?.plan_name === TariffCode.FREE ||
          user?.subscription?.plan_name === TariffCode.BAGOODEX_TEST)
    )
  }, [isLogIn, user])

  // ----------------- Memoized classNames -----------------
  const headerCn = useMemo(() => {
    return cn(styles.headerStyles, {
      [styles.visible]: isSticky || isAlwaysVisible,
      [styles.hidden]: !isSticky && !isAlwaysVisible,
      [styles.isNoBorderBottom]: isNoBorderBottom,
      [styles.isSidebar]: isOpenSidebar && !isMobile,
    })
  }, [isSticky, isNoBorderBottom, isOpenSidebar, isMobile, isAlwaysVisible])

  // ----------------- Callbacks -----------------
  const handleFocusTextareaMainPage = useCallback(() => {
    const textarea = document.getElementById(TEXTAREA_ID_DESKTOP)
    textarea?.focus()
  }, [])

  // ----------------- Memoized JSX -----------------
  const RenderRightButtons = useMemo(() => {
    return (
      <Hydrated>
        <div className={styles.pwaButton}>
          {isShowUpgradePlanButton && <UpgradePlanButton isMainPage />}
          {/*<InstallPwaButton isShowUpgradePlanButton={isShowUpgradePlanButton} />*/}
          {/*<DownloadBrowserButton isVisible={!isShowUpgradePlanButton} />*/}
          <div className={isLogIn ? 'hide-mobile' : ''}>
            <ProfileItem />
          </div>
        </div>
      </Hydrated>
    )
  }, [isShowUpgradePlanButton, isLogIn, isMobile, isOpenSidebar])

  const RenderHeaderContent = useMemo(() => {
    if (isLogIn) {
      return (
        <>
          <MobileHeadIcon
            className={styles.iconMobileHead}
            onClick={toggleSidebar}
          />
          {isOpenSidebar ? (
            <div />
          ) : (
            <div className={styles.buttonsWrapper}>
              <OpenSidebarButton />
              <NewThreadButton onOpen={handleFocusTextareaMainPage} />
            </div>
          )}
        </>
      )
    }

    return !isLogIn && isMobile ? (
      <div>
        <Link to='/' onClick={handleFocusTextareaMainPage}>
          <BaseButton color='grey' size='xs' className={styles.buttonNewThread}>
            <BaseButton.Icon className={styles.icon}>
              <NewThreadIcon />
            </BaseButton.Icon>
            New
          </BaseButton>
        </Link>
      </div>
    ) : (
      <NewThreadButton onOpen={handleFocusTextareaMainPage} />
    )
  }, [
    isLogIn,
    isMobile,
    isOpenSidebar,
    toggleSidebar,
    handleFocusTextareaMainPage,
  ])

  // ----------------- Render -----------------
  if (isWidget) return <div className={styles.headerWidget} />

  return (
    <div className={headerCn}>
      <header className={styles.headerInner} ref={headerRef}>
        {RenderHeaderContent}
        {RenderRightButtons}
      </header>
    </div>
  )
}

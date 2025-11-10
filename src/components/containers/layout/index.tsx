// vendor
import { Outlet, useLocation } from 'react-router-dom'
import { PropsWithChildren, useMemo } from 'react'
import { clsx } from 'clsx'
import { useShallow } from 'zustand/react/shallow'

import { useSidebarStore } from 'src/store/sidebar'
import { useOpenImprovementsStore } from 'src/store/improvements-open'
import { useSettingsStore } from 'src/store/settings'
import { useInitApp } from 'src/libs/use/use-init-app'

import { AuthPopupsContainer } from 'src/components/app/authentication-components/auth-popups-container'
import { Sidebar } from 'src/components/app/sidebar'
import { Hydrated } from 'src/components/containers/hydrated'
import { AppHeader } from 'src/components/app/app-header'
import { SubscriptionPopupsContainer } from 'src/components/app/subscription-popups-container'

// styles
import styles from './styles.module.css'
export const SEARCH_SCROLL_CONTAINER = 'scroll-container'

export function Layout() {
  const isOpenSidebar = useSidebarStore((state) => state.isOpenSidebar)
  const isOpenImprovements = useOpenImprovementsStore(
    (state) => state.isOpenImprovements
  )
  const { isWidget, isExtension } = useSettingsStore(
    useShallow((state) => ({
      isWidget: state.isWidget,
      isExtension: state.isExtension,
    }))
  )

  const location = useLocation()
  const isMain = location.pathname === '/'
  const canShiftOutlet = isOpenSidebar && !(isWidget || isExtension)

  const outletClassName = useMemo(
    () =>
      clsx(styles.outletWrapper, {
        [styles.outletWrapperIsOpenSidebar]: canShiftOutlet,
        [styles.outletWrapperIsOpenSidebarWhenOpenImprovements]:
          canShiftOutlet && isOpenImprovements,
      }),
    [canShiftOutlet, isOpenImprovements]
  )

  // Initializes the app after login
  // by refreshing the token and fetching plans and user history
  useInitApp()

  return (
    <AuthPopupsContainer>
      {isExtension && isMain && <div className={styles.backgroundGradient} />}

      <div
        className={clsx(styles.wrapper, 'customScrollBarVertical')}
        id={SEARCH_SCROLL_CONTAINER}
      >
        <AppHeader />
        <SubscriptionPopupsContainer />

        <Hydrated>
          <Sidebar />
        </Hydrated>

        <Hydrated>
          <div className={outletClassName}>
            <Outlet />
          </div>
        </Hydrated>
      </div>
    </AuthPopupsContainer>
  )
}

export const WrapperContainer = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>) => (
  <div className={clsx(styles.wrapperContainer, className)}>{children}</div>
)

export const WrapperContent = ({
  children,
  className,
  id,
}: PropsWithChildren<{ className?: string; id?: string }>) => (
  <div id={id} className={clsx(styles.wrapperContent, className)}>
    {children}
  </div>
)

import { useCallback, useMemo, useState } from 'react'
import { clsx } from 'clsx'
import { useShallow } from 'zustand/react/shallow'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'
import { useExtensionMessages } from 'src/libs/use/use-extension-messages'
import { useHandleAuthCode } from 'src/libs/use/use-handle-auth-code'
import { dataGtm } from 'src/config/data-gtm'

import BaseButton from 'src/components/ui/base-button'
import { ActionPanel, ActionPanelItem } from 'src/components/ui/action-panel'
import { UserInfo } from './components/user-info'
import { PopupKey } from 'src/components/app/subscription-popups-container'
import ProfileImage from './images/profile.png'
import UserIcon from 'src/images/user.svg?react'
import LogOutIcon from 'src/images/log-out.svg?react'
import CardIcon from 'src/images/card.svg?react'
import GiftIcon from 'src/images/present.svg?react'
import StarsIcon from 'src/images/stars.svg?react'
import ArrowUpIcon from 'src/images/chevron.svg?react'

import styles from './styles.module.css'

export function ProfileItem({ isSidebar }: { isSidebar?: boolean }) {
  const { is_log_in, user, logOut, signIn, getUser } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
      logOut: state.logOut,
      signIn: state.signIn,
      getUser: state.getUser,
    }))
  )
  const isExtension = useSettingsStore((state) => state.isExtension)

  const isLogIn = Boolean(is_log_in && user)

  const userPicture = useMemo(() => user?.picture || ProfileImage, [user])

  const [isOpen, setOpen] = useState(false)

  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname + location.search
  const hash = location.hash

  // ---------- Хелперы ----------
  const handleLogOut = useCallback(
    async (sendMessage = true) => {
      await logOut?.(sendMessage)
      if (isExtension) {
        navigate('/auth')
        return
      }
      if (location.pathname !== '/') navigate('/')
    },
    [logOut, isExtension, navigate, location.pathname]
  )

  const openPopup = (key: PopupKey) => {
    setOpen(false)
    navigate(`${path}#${key === 'plans' ? 'plans' : key}`)
  }

  const [searchParams] = useSearchParams()
  const authCode = searchParams.get('code')
  // для авторизации
  useHandleAuthCode({ signIn })

  // для сообщений в экстеншен
  useExtensionMessages({
    isExtension,
    isLogIn,
    hash,
    path,
    getUser,
    handleLogOut,
  })

  const trigger = useMemo(
    () => (
      <div
        onClick={(e) => {
          e.stopPropagation()
          if (!isOpen) setOpen(true)
        }}
        className={clsx(styles.wrapper, 'opacity-animation', {
          [styles.wrapperForSideBar]: isSidebar,
          [styles.wrapperForSideBarOpen]: isSidebar && isOpen,
          [styles.wrapperForExtension]: isExtension,
        })}
      >
        <img
          alt='Profile Image'
          className={styles.image}
          src={userPicture}
          draggable={false}
        />
        {isSidebar && <div className={styles.name}>{user?.username}</div>}
        {isSidebar && (
          <ArrowUpIcon
            width={18}
            height={18}
            className={clsx(styles.iconArrow, {
              [styles.iconRotate]: isOpen,
            })}
          />
        )}
      </div>
    ),
    [isOpen, isSidebar, isExtension, userPicture]
  )

  // не рендерим пока не залогинились
  if (authCode) return null

  return (
    <>
      {!isLogIn && (
        <BaseButton
          color='transparent'
          size='default'
          onClick={() => navigate('/auth')}
          className={clsx(styles.button, { ['w-100p jc-start']: isSidebar })}
          data-gtm={dataGtm['sign-in']}
        >
          <UserIcon width={17} height={17} className={styles.icon} />
          Sign In
        </BaseButton>
      )}

      {isLogIn && (
        <ActionPanel
          open={isOpen}
          onOpenChange={setOpen}
          side={isSidebar ? 'top' : 'bottom'}
          align={isSidebar ? 'start' : 'end'}
          sideOffset={isSidebar ? 15 : 10}
          className={clsx(styles.panelWrapper, {
            [styles.withShadow]: isSidebar,
            [styles.extensionShadow]: isExtension,
          })}
          trigger={trigger}
        >
          <>
            <UserInfo user={user} />

            {isExtension && (
              <BaseButton
                color='black'
                onClick={() => openPopup('plans')}
                className={styles.upgradeButton}
              >
                <StarsIcon className={styles.fillIcon} />
                Upgrade Plan
              </BaseButton>
            )}

            <div className={styles.divider} />

            {!isExtension && (
              <ActionPanelItem onClick={() => openPopup('plans')}>
                <StarsIcon className={styles.fillIconStars} />
                Upgrade Plan
              </ActionPanelItem>
            )}
            <ActionPanelItem onClick={() => openPopup('subscription')}>
              <CardIcon className={styles.strokeIcon} />
              Subscription
            </ActionPanelItem>
            <ActionPanelItem onClick={() => openPopup('referral')}>
              <GiftIcon className={styles.strokeIcon} />
              Invite & Earn
            </ActionPanelItem>

            <div className={styles.divider} />

            <ActionPanelItem onClick={handleLogOut}>
              <LogOutIcon className={styles.strokeRedIcon} />
              <span className={styles.logOutText}>Log out</span>
            </ActionPanelItem>
          </>
        </ActionPanel>
      )}
    </>
  )
}

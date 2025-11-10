import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { formatFollowUps } from 'src/routes/search/utils'
import { useLocation, useNavigate } from 'react-router-dom'

import { RegenerateWithChatButton } from '../regenerate-with-chat-button'
import { PopupProps } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import { AuthPopup } from 'src/components/app/authentication-components/auth-popup'
import IconImage from 'src/images/unlock-image-generation-popup.png'
import IconStars from 'src/images/stars-plans.svg?react'
import { POPUP_IDS } from '../auth-popups-container'
import { dataGtm } from 'src/config/data-gtm'

import css from './styles.module.css'

export default function UnlockImageGenerationPopup({
  visible,
  onClose,
}: PopupProps) {
  const { is_log_in, user, followUps } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
      followUps: state.followUps,
    }))
  )

  const formattedFollowUps = formatFollowUps(followUps)
  const item = formattedFollowUps.at(-1)

  const isLogIn = Boolean(is_log_in && user)

  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname + location?.search

  const handleOpenPlans = () => {
    navigate(`${path}#plans`)
    onClose()
  }

  const handleLogIn = async () => {
    navigate('/auth')
    onClose()
  }

  return (
    <AuthPopup variant={'bottom-big'} visible={visible} onClose={onClose}>
      <div className={css.row} id={POPUP_IDS.FIRST_IMAGE}>
        <img src={IconImage} alt='' className={css.image} draggable={false} />

        <div className={css.title}>
          {isLogIn ? 'Upgrade Plan to unlock' : 'Sign Up below to unlock'}
          <br />
          Image Generation!
        </div>
      </div>

      <div className={css.buttonsRow}>
        {isLogIn ? (
          <BaseButton
            color='white'
            size='default'
            className={css.buttonUpgrade}
            onClick={handleOpenPlans}
            id={POPUP_IDS.FIRST_IMAGE + '_UPGRADE_BUTTON'}
            data-gtm={dataGtm['upgrade']}
          >
            <IconStars className={css.icon} />
            Upgrade Plan
          </BaseButton>
        ) : (
          <BaseButton
            color='white'
            size='default'
            className={css.button}
            onClick={handleLogIn}
            id={POPUP_IDS.FIRST_IMAGE + '_CONTINUE_BUTTON'}
            data-gtm={dataGtm['sign-in']}
          >
            Sign In
          </BaseButton>
        )}

        {item && (
          <RegenerateWithChatButton
            item={item}
            isFirst={formattedFollowUps.length === 1}
            onClose={onClose}
            id={POPUP_IDS.FIRST_IMAGE}
          />
        )}
      </div>
    </AuthPopup>
  )
}

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

import css from '../unlock-image-generation-popup/styles.module.css'

export default function LimitImageGenerationPopup({
  visible,
  onClose,
}: PopupProps) {
  const { followUps, limit_exceeded_period } = useSearchStore(
    useShallow((state) => ({
      followUps: state.followUps,
      limit_exceeded_period: state.limit_exceeded_period,
    }))
  )
  const isDailyLimits = limit_exceeded_period === 'day'

  const formattedFollowUps = formatFollowUps(followUps)
  const item = formattedFollowUps.at(-1)

  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname + location?.search

  const handleOpenPlans = () => {
    navigate(`${path}#plans`)
    onClose()
  }

  return (
    <AuthPopup
      variant={'bottom-big'}
      color={'orange'}
      visible={visible}
      onClose={onClose}
    >
      <div className={css.row} id={POPUP_IDS.LIMIT_EXCEEDED_IMAGE}>
        <img src={IconImage} alt='' className={css.image} draggable={false} />

        <div className={css.title}>
          {isDailyLimits ? (
            'Daily limit reached'
          ) : (
            <>
              Plan to unlock
              <br />
              Image Generation!
            </>
          )}
          {isDailyLimits && (
            <div className={css.descriptionDesktop}>
              Try again tomorrow or upgrade your plan
            </div>
          )}
        </div>
      </div>

      <div className={css.buttonsRow}>
        {!item && <div />}

        <BaseButton
          color='white'
          size='default'
          className={css.buttonUpgrade}
          onClick={handleOpenPlans}
          id={POPUP_IDS.LIMIT_EXCEEDED_IMAGE + '_UPGRADE_BUTTON'}
          data-gtm={dataGtm['upgrade']}
        >
          <IconStars className={css.icon} />
          Upgrade Plan
        </BaseButton>

        {item && (
          <RegenerateWithChatButton
            item={item}
            isFirst={formattedFollowUps.length === 1}
            onClose={onClose}
            id={POPUP_IDS.LIMIT_EXCEEDED_IMAGE}
          />
        )}
      </div>
    </AuthPopup>
  )
}

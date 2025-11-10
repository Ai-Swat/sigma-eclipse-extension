import { useLocation, useNavigate } from 'react-router-dom'
import { useSearchStore } from 'src/store'
import { PopupProps } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import { AuthPopup } from 'src/components/app/authentication-components/auth-popup'
import IconLimits from 'src/images/popup-requests-limit.svg?react'
import IconStars from 'src/images/stars-plans.svg?react'
import { POPUP_IDS } from '../auth-popups-container'
import { dataGtm } from 'src/config/data-gtm'

import css from './styles.module.css'

export default function RequestsLimitReachedPopup({
  visible,
  onClose,
}: PopupProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname + location?.search
  const limit_exceeded_period = useSearchStore(
    (state) => state.limit_exceeded_period
  )
  const isDailyLimits = limit_exceeded_period === 'day'

  const handleOpenPlans = () => {
    navigate(`${path}#plans`)
    onClose()
  }

  return (
    <AuthPopup variant={'blue'} visible={visible} onClose={onClose}>
      <div className={css.row} id={POPUP_IDS.LIMIT_EXCEEDED}>
        <IconLimits className={css.image} />

        <div className={css.title}>
          {isDailyLimits
            ? 'Daily limit reached'
            : 'Requests Limit Reached,\nUpgrade Plan to Unlock!'}
          {isDailyLimits && (
            <div className={css.descriptionDesktop}>
              Try again tomorrow or upgrade your plan
            </div>
          )}
        </div>

        <div className={css.description}>
          {isDailyLimits ? (
            <>
              Try again tomorrow
              <br />
              or upgrade your plan
            </>
          ) : (
            <>
              Upgrade your plan
              <br />
              or wait for the next recharge
            </>
          )}
        </div>
      </div>

      <BaseButton
        color='white'
        size='default'
        className={css.button}
        onClick={handleOpenPlans}
        id={POPUP_IDS.LIMIT_EXCEEDED + '_UPGRADE_BUTTON'}
        data-gtm={dataGtm['upgrade']}
      >
        <IconStars className={css.icon} />
        Upgrade Plan
      </BaseButton>
    </AuthPopup>
  )
}

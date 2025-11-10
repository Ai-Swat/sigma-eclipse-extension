import { useLocation, useNavigate } from 'react-router-dom'
import { PopupProps } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import { AuthPopup } from 'src/components/app/authentication-components/auth-popup'
import IconStarsImage from 'src/images/image-stars.png'
import IconStars from 'src/images/stars-plans.svg?react'
import { POPUP_IDS } from '../auth-popups-container'
import { dataGtm } from 'src/config/data-gtm'

import css from './styles.module.css'

export default function UpgradePlanLimitedPopup({
  visible,
  onClose,
}: PopupProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname + location?.search

  const handleOpenPlans = () => {
    navigate(`${path}#plans`)
    onClose()
  }

  return (
    <AuthPopup variant={'right-blue'} visible={visible} onClose={onClose}>
      <div className={css.column} id={POPUP_IDS.UPGRADE_PLAN}>
        <img
          src={IconStarsImage}
          alt=''
          className={css.image}
          draggable={false}
        />

        <div className={css.title}>
          Limited Access
          <br />
          Activated
        </div>
        <div className={css.description}>
          You’re in — but some features are locked. Upgrade now to unlock the
          full experience!
        </div>
      </div>

      <BaseButton
        color='white'
        size='default'
        className={css.button}
        onClick={handleOpenPlans}
        id={POPUP_IDS.UPGRADE_PLAN + '_UPGRADE_BUTTON'}
        data-gtm={dataGtm['upgrade']}
      >
        <IconStars className={css.icon} />
        Upgrade Plan
      </BaseButton>
    </AuthPopup>
  )
}

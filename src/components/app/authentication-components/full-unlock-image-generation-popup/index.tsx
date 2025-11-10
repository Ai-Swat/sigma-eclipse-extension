import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSearchStore } from 'src/store'
import { useShallow } from 'zustand/react/shallow'

import { PopupProps } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import { AuthPopup } from 'src/components/app/authentication-components/auth-popup'
import { MainLogoSearch } from 'src/components/ui/main-logo-search'
import IconImage from 'src/images/unlock-image-generation-popup.png'
import IconStars from 'src/images/stars-plans.svg?react'
import { POPUP_IDS } from '../auth-popups-container'
import { dataGtm } from 'src/config/data-gtm'
import { AuthButtons } from '../auth-buttons'

import css from './styles.module.css'

export default function FullUnlockImageGenerationPopup({
  visible,
  onClose,
}: PopupProps) {
  const { is_log_in, user } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
    }))
  )

  const isLogIn = Boolean(is_log_in && user)

  const navigate = useNavigate()
  const location = useLocation()
  const path = location.pathname + location?.search

  const handleOpenPlans = () => {
    navigate(`${path}#plans`)
    onClose()
  }

  return (
    <AuthPopup variant={'full'} visible={visible} onClose={onClose}>
      <div className={css.wrapperLogotype} id={POPUP_IDS.SECOND_IMAGE}>
        <MainLogoSearch />
      </div>

      <div className={css.column}>
        <img src={IconImage} alt='' className={css.image} draggable={false} />

        <div className={css.title}>
          {isLogIn ? 'Upgrade Plan to unlock' : 'Sign up to unlock'}
          <br />
          image generation!
        </div>
      </div>

      {isLogIn ? (
        <BaseButton
          color='white'
          size='default'
          className={css.buttonUpgrade}
          onClick={handleOpenPlans}
          id={POPUP_IDS.SECOND_IMAGE + '_UPGRADE_BUTTON'}
          data-gtm={dataGtm['upgrade']}
        >
          <IconStars className={css.icon} />
          Upgrade Plan
        </BaseButton>
      ) : (
        <AuthButtons
          id={POPUP_IDS.SECOND_IMAGE}
          classNameButton={css.button}
          classNameWrapper={css.buttonWrapper}
        />
      )}

      <div className={css.footer}>
        By continuing, you agree to Sigma’s
        <br />
        <Link to='/terms-of-service' target={'_blank'}>
          Terms of Service
        </Link>{' '}
        and{' '}
        <Link to='/privacypolicy' target={'_blank'}>
          Privacy Policy
        </Link>
      </div>
    </AuthPopup>
  )
}

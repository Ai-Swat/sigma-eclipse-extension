import { Link } from 'react-router-dom'
import { PopupProps } from 'src/components/ui/popup'
import { AuthPopup } from 'src/components/app/authentication-components/auth-popup'
import { MainLogoSearch } from 'src/components/ui/main-logo-search'
import IconSearch from 'src/images/popup-image-search.png'
import { POPUP_IDS } from '../auth-popups-container'
import { AuthButtons } from '../auth-buttons'

import css from './styles.module.css'

export default function FullSignUpPopup({ visible, onClose }: PopupProps) {
  return (
    <AuthPopup variant={'full'} visible={visible} onClose={onClose}>
      <div className={css.wrapperLogotype} id={POPUP_IDS.THIRD}>
        <MainLogoSearch />
      </div>

      <div className={css.column}>
        <img src={IconSearch} alt='' className={css.image} draggable={false} />

        <div className={css.title}>
          Sign in or sign up <br />
          to continue your journey
        </div>
      </div>

      <AuthButtons
        id={POPUP_IDS.THIRD}
        classNameButton={css.button}
        classNameWrapper={css.buttonWrapper}
      />

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

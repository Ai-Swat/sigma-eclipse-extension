import { PopupProps } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import { AuthPopup } from 'src/components/app/authentication-components/auth-popup'
import IconSearch from 'src/images/popup-image-search.png'
import { POPUP_IDS } from '../auth-popups-container'
import { dataGtm } from 'src/config/data-gtm'
import { useNavigate } from 'react-router-dom'

import css from './styles.module.css'

export default function SignUpPopup({ visible, onClose }: PopupProps) {
  const navigate = useNavigate()
  const handleLogIn = async () => {
    navigate('/auth')
    onClose()
  }

  return (
    <AuthPopup variant={'bottom'} visible={visible} onClose={onClose}>
      <div className={css.row} id={POPUP_IDS.SECOND}>
        <img src={IconSearch} alt='' className={css.image} draggable={false} />

        <div className={css.title}>
          Sign Up below to unlock
          <br />
          the full potential of Sigma
        </div>

        <div className={css.description}>
          Sign in or create an account
          <br />
          to search smarter and faster
        </div>
      </div>

      <BaseButton
        color='white'
        size='default'
        className={css.button}
        onClick={handleLogIn}
        id={POPUP_IDS.SECOND + '_CONTINUE_BUTTON'}
        data-gtm={dataGtm['sign-in']}
      >
        Sign In
      </BaseButton>
    </AuthPopup>
  )
}

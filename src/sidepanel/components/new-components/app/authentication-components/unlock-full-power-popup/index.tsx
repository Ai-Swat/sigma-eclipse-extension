import { PopupProps } from 'src/components/ui/popup'
import { AuthPopup } from 'src/components/app/authentication-components/auth-popup'
import IconStars from 'src/images/image-stars.png'
import { POPUP_IDS } from '../auth-popups-container'
import { AuthButtons } from '../auth-buttons'

import css from './styles.module.css'

export default function UnlockFullPowerPopup({ visible, onClose }: PopupProps) {
  return (
    <AuthPopup variant={'right'} visible={visible} onClose={onClose}>
      <div className={css.column} id={POPUP_IDS.FIRST}>
        <img src={IconStars} alt='' className={css.image} draggable={false} />

        <div className={css.title}>
          Unlock Full power <br />
          of Sigma
        </div>
        <div className={css.description}>
          Sign in or create an account
          <br />
          to search smarter and faster
        </div>
      </div>

      <AuthButtons id={POPUP_IDS.FIRST} classNameButton={css.button} />
    </AuthPopup>
  )
}

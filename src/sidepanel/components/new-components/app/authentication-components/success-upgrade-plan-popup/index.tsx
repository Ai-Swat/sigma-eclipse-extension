import { Popup, PopupProps } from 'src/components/ui/popup'
import ImageSuccess from 'src/images/image-success-billing.png'
import BaseButton from 'src/components/ui/base-button'
import ProgressBar from 'src/components/ui/progress-bar'
import css from './styles.module.css'

export default function SuccessUpgradePlanPopup({
  visible,
  onClose,
}: PopupProps) {
  return (
    <Popup withCloseButton visible={visible} onClose={onClose} fullHeight>
      <div className={css.wrapper}>
        <div className={css.card}>
          <div className={css.firstBlock}>
            <img
              src={ImageSuccess}
              alt={'Success'}
              className={css.image}
              draggable={false}
            />

            <div className={css.textBlock}>
              <div className={css.title}>
                Payment successful.
                <br />
                Let’s get started!
              </div>
              <div className={css.description}>
                Your subscription is now active.
                <br />
                Enjoy full access to all features
              </div>
            </div>
          </div>

          <div className={css.bottomBlock}>
            <BaseButton
              onClick={onClose}
              size='m'
              color='primary'
              className={css.button}
            >
              Back to Search
            </BaseButton>
            <ProgressBar isText onComplete={onClose} />
          </div>
        </div>
      </div>
    </Popup>
  )
}

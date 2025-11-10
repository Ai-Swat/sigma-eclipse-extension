import { Popup, PopupProps } from 'src/components/ui/popup'
import { WrapperContent } from 'src/components/containers/layout'
import ImageFailed from 'src/images/image-payment-failed.png'
import BaseButton from 'src/components/ui/base-button'
import css from './styles.module.css'

export default function FailedPaymentPlanPopup({
  visible,
  onClose,
  onTryAgain,
}: PopupProps & { onTryAgain: () => void }) {
  return (
    <Popup withCloseButton visible={visible} onClose={onClose} fullHeight>
      <WrapperContent className={css.wrapper}>
        <div className={css.card}>
          <div className={css.firstBlock}>
            <img
              src={ImageFailed}
              alt={'Failed'}
              className={css.image}
              draggable={false}
            />

            <div className={css.textBlock}>
              <div className={css.title}>
                Oh No!
                <br />
                Payment Failed
              </div>
              <div className={css.description}>
                Your payment got cancelled,
                <br />
                please try again
              </div>
            </div>
          </div>

          <div className={css.bottomBlock}>
            <BaseButton
              onClick={onTryAgain}
              size='m'
              color='primary'
              className={css.button}
            >
              Try Again
            </BaseButton>
          </div>
        </div>
      </WrapperContent>
    </Popup>
  )
}

import { Popup } from 'src/components/ui/popup'
import BaseButton from 'src/components/ui/base-button'
import styles from './styles.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  confirmAction: () => void
}

const DowngradeToFreePlanPopup = ({
  isOpen,
  onClose,
  confirmAction,
}: Props) => {
  return (
    <Popup
      withCloseButton
      visible={isOpen}
      onClose={onClose}
      title='Are you sure?'
      className={styles.popup}
    >
      <div className={'w-100p'}>
        <div className={styles.divider} />
        <div className={styles.textBlock}>
          By switching to the Free plan, you’ll lose access to premium features.
          Do you want to continue?
        </div>
        <div className={styles.buttons}>
          <BaseButton color='grey' onClick={onClose}>
            Cancel
          </BaseButton>
          <BaseButton color='black' onClick={confirmAction}>
            Continue
          </BaseButton>
        </div>
      </div>
    </Popup>
  )
}

export default DowngradeToFreePlanPopup

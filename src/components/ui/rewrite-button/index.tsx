import RefreshIcon from 'src/images/arrow-refresh.svg?react'
import styles from './styles.module.css'
import BaseButton from '../base-button'
import { TooltipDefault } from '../tooltip'

interface Props {
  onClick: () => void
}

const RewriteButton = ({ onClick }: Props) => {
  return (
    <TooltipDefault text='Regenerate'>
      <div className='relative'>
        <BaseButton
          onClick={onClick}
          color='transparent-hover'
          label={'Regenerate'}
        >
          <RefreshIcon className={styles.icon} />
        </BaseButton>
      </div>
    </TooltipDefault>
  )
}

export default RewriteButton

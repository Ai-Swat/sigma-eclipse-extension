import { memo } from 'react'
import { TooltipDefault } from 'src/components/ui/tooltip'
import { Loader } from 'src/components/ui/loader'
import CheckIcon from 'src/images/check-icon.svg?react'
import PauseIcon from 'src/images/pause-state.svg?react'
import FailedIcon from 'src/images/failed.svg?react'
import styles from './styles.module.css'

function TaskStatusIconComponent({
  isPaused,
  isDone,
  isFailed,
}: {
  isPaused?: boolean
  isDone?: boolean
  isFailed?: boolean
}) {
  if (isFailed) {
    return (
      <TooltipDefault text={'Oops! The task failed'} side={'top'}>
        <div className='relative'>
          <FailedIcon width={18} height={18} className={styles.failed} />
        </div>
      </TooltipDefault>
    )
  }

  if (isDone) {
    return <CheckIcon width={18} height={18} className={styles.check} />
  }

  if (isPaused) {
    return (
      <TooltipDefault text={'Waiting for your reply'} side={'top'}>
        <div className='relative'>
          <PauseIcon width={18} height={18} className={styles.pause} />
        </div>
      </TooltipDefault>
    )
  }

  return <Loader size={18} strokeWidth={9} className={styles.loader} />
}

export const TaskStatusIcon = memo(TaskStatusIconComponent)

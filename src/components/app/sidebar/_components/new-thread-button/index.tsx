import { Link } from 'react-router-dom'
import { TooltipDefault } from 'src/components/ui/tooltip'
import BaseButton from 'src/components/ui/base-button'
import NewThreadIcon from 'src/images/new-thread.svg?react'
import { Logo } from 'src/components/ui/logo'
import NewThread from 'src/images/plus.svg?react'

import css from './styles.module.css'

export default function NewThreadButton({
  onOpen,
  isLogo,
  isExtension,
}: {
  onOpen?: () => void
  isLogo?: boolean
  isExtension?: boolean
}) {
  return (
    <TooltipDefault text='New Thread'>
      <div className='relative'>
        <Link to={'/'} onClick={onOpen} aria-label='Open New Thread'>
          {isLogo ? (
            <div className={css.logoWrapper}>
              <Logo className={css.logo} />
            </div>
          ) : (
            <BaseButton
              color='transparent-hover'
              iconColor='icon-tertiary'
              label='New Thread'
            >
              {isExtension ? (
                <NewThread className={css.newChatExtension} />
              ) : (
                <NewThreadIcon />
              )}
            </BaseButton>
          )}
        </Link>
      </div>
    </TooltipDefault>
  )
}

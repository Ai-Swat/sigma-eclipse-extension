import { clsx } from 'clsx'
import { AuthProvider } from 'src/store/types'
import { useSearchStore } from 'src/store'
import { dataGtm } from 'src/config/data-gtm'
import BaseButton from 'src/components/ui/base-button'
import IconGoogle from 'src/images/google.svg?react'
import IconApple from 'src/images/apple.svg?react'
import css from './styles.module.css'

export function AuthButtons({
  id,
  classNameWrapper,
  classNameButton,
}: {
  id: string
  classNameWrapper?: string
  classNameButton?: string
}) {
  const getOAuthUrl = useSearchStore((state) => state.getOAuthUrl)

  const handleLogIn = async (type: AuthProvider) => {
    const res = await getOAuthUrl(type)
    if (res) window.location.href = res.redirect_url
  }

  return (
    <div className={clsx(css.wrapperButton, classNameWrapper)}>
      <BaseButton
        color='white'
        size='default'
        className={clsx(css.button, classNameButton)}
        id={id + '_CONTINUE_BUTTON'}
        onClick={() => handleLogIn(AuthProvider.GOOGLE)}
        data-gtm={dataGtm['continue-google']}
      >
        <IconGoogle width={20} height={20} className={css.icon} />
        Continue with Google
      </BaseButton>
      <BaseButton
        color='white'
        size='default'
        className={clsx(css.button, classNameButton)}
        id={id + '_CONTINUE_BUTTON'}
        onClick={() => handleLogIn(AuthProvider.APPLE)}
        data-gtm={dataGtm['continue-apple']}
      >
        <IconApple width={20} height={20} className={css.iconApple} />
        Continue with Apple
      </BaseButton>
    </div>
  )
}

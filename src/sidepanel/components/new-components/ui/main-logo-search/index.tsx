import { Logo } from '../logo'

import css from './styles.module.css'

export function MainLogoSearch() {
  return (
    <div className={css.logoWrapper}>
      <Logo className={css.logo} />
      Sigma
    </div>
  )
}

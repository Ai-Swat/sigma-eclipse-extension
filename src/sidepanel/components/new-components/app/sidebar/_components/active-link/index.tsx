import { ReactElement } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { clsx } from 'clsx'

import css from './styles.module.css'

export default function ActiveLink({
  title,
  url,
  icon,
  doNotShowSelection,
  onOpen,
}: {
  title: string
  url: string
  icon: ReactElement
  doNotShowSelection?: boolean
  onOpen?: () => void
}) {
  const location = useLocation()
  const isActive = !doNotShowSelection && location.pathname.includes(url)

  return (
    <Link
      to={url}
      onClick={onOpen}
      className={clsx(css.row, { [css.isActive]: isActive })}
    >
      {icon}
      <span>{title}</span>
    </Link>
  )
}

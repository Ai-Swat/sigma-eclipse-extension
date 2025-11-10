import { useLocation, useNavigate } from 'react-router-dom'
import { clsx } from 'clsx'
import { dataGtm } from 'src/config/data-gtm'
import BaseButton from 'src/components/ui/base-button'
import { useSettingsStore } from 'src/store/settings'
import IconStars from 'src/images/stars.svg?react'
import css from './styles.module.css'

export function UpgradePlanButton({
  isMainPage,
  isFullWidthMobile,
}: {
  isMainPage?: boolean
  isFullWidthMobile?: boolean
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const isExtension = useSettingsStore((state) => state.isExtension)
  const path = location.pathname + location?.search

  const handleOpenPlans = () => {
    navigate(`${path}#plans`)
  }

  return (
    <BaseButton
      color={isMainPage ? 'black' : 'primary'}
      size={'default'}
      className={clsx(css.buttonUpgrade, {
        [css.isFullWidthMobile]: isFullWidthMobile,
        [css.isFullWidthExtension]: isExtension,
      })}
      onClick={handleOpenPlans}
      data-gtm={isMainPage ? dataGtm['upgrade'] : ''}
    >
      <IconStars
        className={clsx(css.iconStars, {
          [css.isMainPage]: isMainPage,
        })}
      />
      Upgrade
    </BaseButton>
  )
}

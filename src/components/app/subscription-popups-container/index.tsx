import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import loadable from '@loadable/component'
import { useSearchStore } from 'src/store'
import { useShallow } from 'zustand/react/shallow'

const SubscriptionPopup = loadable(
  () =>
    import('src/components/app/authentication-components/subscription-popup')
)
const ReferralPopup = loadable(
  () => import('src/components/app/authentication-components/referral-popup')
)
const UpgradePlanPopup = loadable(
  () =>
    import('src/components/app/authentication-components/upgrade-plan-popup')
)
const SuccessUpgradePlanPopup = loadable(
  () =>
    import(
      'src/components/app/authentication-components/success-upgrade-plan-popup'
    )
)
const FailedPaymentPlanPopup = loadable(
  () =>
    import(
      'src/components/app/authentication-components/failed-payment-plan-popup'
    )
)

export type PopupKey =
  | 'subscription'
  | 'plans'
  | 'success'
  | 'failed'
  | 'referral'

export const SubscriptionPopupsContainer = () => {
  const [popupState, setPopupState] = useState<Record<PopupKey, boolean>>({
    subscription: false,
    plans: false,
    success: false,
    failed: false,
    referral: false,
  })

  const { is_log_in, user } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
    }))
  )
  const isLogIn = Boolean(is_log_in && user)

  const location = useLocation()
  const navigate = useNavigate()
  const path = location.pathname + location.search

  useEffect(() => {
    const hash = location.hash
    setPopupState({
      subscription: hash === '#subscription',
      plans: hash === '#plans',
      success: hash === '#success-payment',
      failed: hash === '#failed-payment',
      referral: hash === '#referral',
    })
  }, [location.hash, isLogIn])

  const closePopup = () => {
    navigate(path)
  }

  const handleTryAgain = () => {
    navigate(`${path}#plans`)
  }

  const popups = useMemo(
    () => [
      <SubscriptionPopup
        key='subscription'
        visible={popupState.subscription}
        onClose={closePopup}
      />,
      <ReferralPopup
        key='referral'
        visible={popupState.referral}
        onClose={closePopup}
      />,
      <UpgradePlanPopup
        key='plans'
        visible={popupState.plans}
        onClose={closePopup}
      />,
      <SuccessUpgradePlanPopup
        key='success'
        visible={popupState.success}
        onClose={closePopup}
      />,
      <FailedPaymentPlanPopup
        key='failed'
        visible={popupState.failed}
        onClose={closePopup}
        onTryAgain={handleTryAgain}
      />,
    ],
    [popupState, closePopup, handleTryAgain]
  )

  if (!isLogIn) return null

  return <>{popups}</>
}

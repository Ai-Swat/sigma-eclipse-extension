import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useLocation, useNavigate } from 'react-router-dom'
import cn from 'clsx'

import { Plan, TariffCode } from 'src/store/types'
import { useEvent } from 'src/libs/use/use-event'
import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'

import { Popup, PopupProps } from 'src/components/ui/popup'
import { TabBarItem, TabBarWrapper } from 'src/components/ui/tab-bar'
import { Badge } from 'src/components/ui/badge'
import DowngradeToFreePlanPopup from 'src/components/app/app-popups/downgrade-to-free-plan-popup'

import { BillingCard } from './_components/billing-plan-card'
import { MobilePlans } from './_components/mobile-plans'

import css from './styles.module.css'

enum TABS {
  ANNUALLY = 'ANNUALLY',
  MONTHLY = 'MONTHLY',
}

export const REDIRECT_URL_FROM_STRIPE = 'REDIRECT_URL_FROM_STRIPE'

export default function UpgradePlanPopup({ visible, onClose }: PopupProps) {
  const { plans, getBillingStripeUrl } = useSearchStore(
    useShallow((state) => ({
      plans: state.plans,
      getBillingStripeUrl: state.getBillingStripeUrl,
    }))
  )
  const navigate = useNavigate()
  const isExtension = useSettingsStore((state) => state.isExtension)

  const monthlyPlus = plans?.find((el) => el.code === TariffCode.PLUS_MONTHLY)
  const monthlyPro = plans?.find((el) => el.code === TariffCode.PRO_MONTHLY)

  const earlyPlus = plans?.find((el) => el.code === TariffCode.PLUS_YEARLY)
  const earlyPro = plans?.find((el) => el.code === TariffCode.PRO_YEARLY)

  const free = plans?.find((el) => el.code === TariffCode.FREE)

  const [tabPlans, setTabPlans] = useState(TABS.ANNUALLY)
  const [activePlans, setActivePlans] = useState<Plan[]>([])

  const [isShowConfirmationPopup, setIsShowConfirmationPopup] = useState(false)

  useEffect(() => {
    if (tabPlans === TABS.MONTHLY && free && monthlyPlus && monthlyPro) {
      setActivePlans([free, monthlyPlus, monthlyPro])
    }
    if (tabPlans === TABS.ANNUALLY && free && earlyPlus && earlyPro) {
      setActivePlans([free, earlyPlus, earlyPro])
    }
  }, [tabPlans, plans])

  const location = useLocation()
  const path = location.pathname + location?.search

  const handleUpgrade = useEvent(async (id: string) => {
    const url = await getBillingStripeUrl(id)

    if (url?.redirect_url) {
      localStorage?.setItem(REDIRECT_URL_FROM_STRIPE, path)

      if (isExtension) {
        window.open(url.redirect_url, '_blank')
        return
      }

      window.open(url.redirect_url, '_self')
    }
  })

  const closeConfirmationPopup = () => {
    setIsShowConfirmationPopup(false)
  }

  const downgradeToFreePlan = async () => {
    if (!free) return

    closeConfirmationPopup()
    navigate('/')
    await getBillingStripeUrl(free.id)
  }

  return (
    <>
      <Popup withCloseButton visible={visible} onClose={onClose} fullHeight>
        <div className={css.backgroundGradient} />

        {!isExtension && (
          <div className={css.desktopWrapper}>
            <div className={css.title}>Unlock all Sigma Features!</div>
            <div className={css.tabs}>
              <TabBarWrapper>
                <TabBarItem
                  onPress={() => setTabPlans(TABS.MONTHLY)}
                  isActive={tabPlans === TABS.MONTHLY}
                >
                  Monthly
                </TabBarItem>

                <TabBarItem
                  onPress={() => setTabPlans(TABS.ANNUALLY)}
                  isActive={tabPlans === TABS.ANNUALLY}
                >
                  Yearly
                  <Badge>20% OFF</Badge>
                </TabBarItem>
              </TabBarWrapper>
            </div>

            <div className={css.cards}>
              {activePlans?.map((el) => (
                <BillingCard
                  handleUpgrade={handleUpgrade}
                  handleDowngrade={handleUpgrade}
                  key={el.code}
                  plan={el}
                  openConfirmationPopup={() => setIsShowConfirmationPopup(true)}
                />
              ))}
            </div>
          </div>
        )}

        <div
          className={cn(css.mobileWrapper, {
            [css.isExtension]: isExtension,
          })}
        >
          <MobilePlans
            handleUpgrade={handleUpgrade}
            handleDowngrade={handleUpgrade}
          />
        </div>
      </Popup>
      <DowngradeToFreePlanPopup
        isOpen={isShowConfirmationPopup}
        onClose={closeConfirmationPopup}
        confirmAction={downgradeToFreePlan}
      />
    </>
  )
}

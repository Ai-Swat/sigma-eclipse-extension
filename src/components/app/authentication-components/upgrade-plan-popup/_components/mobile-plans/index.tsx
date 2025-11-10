import React, { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { Plan, TariffCode } from 'src/store/types'
import { useSearchStore } from 'src/store'

import { BillingButtonItem } from '../billing-button-item'
import { Space } from 'src/components/ui/space'
import { MobileBillingPlanRow } from '../mobile-plan-row'
import { PanelItemMobile } from '../panel-item-mobile'

import ImagePlus from '../images/plus.webp'
import ImagePro from '../images/pro.webp'
import ImageIcon from 'src/images/models/image.svg?react'
import TextGenerationIcon from 'src/images/models/text.svg?react'
import BrowserAgent from 'src/images/models/browser-agent.svg?react'
import SearchIcon from 'src/images/models/web-search.svg?react'
import ChatIcon from 'src/images/models/text-chat.svg?react'
import IconMedal from 'src/images/medal.svg?react'
import IconPlus from 'src/images/plus-circle.svg?react'
// import IconTelegram from 'src/images/models/telegram.svg?react'
import IconMicroscope from 'src/images/microscope.svg?react'

import css from './styles.module.css'

export function MobilePlans(props: {
  handleDowngrade: (id: string) => void
  handleUpgrade: (id: string) => void
}) {
  const { handleDowngrade, handleUpgrade } = props

  const { plans, user } = useSearchStore(
    useShallow((state) => ({
      plans: state.plans,
      user: state.user,
    }))
  )

  const currentPlan = user?.subscription?.plan_name && {
    code: user?.subscription?.plan_name,
  }

  const monthlyPlus = plans?.find((el) => el.code === TariffCode.PLUS_MONTHLY)
  const earlyPlus = plans?.find((el) => el.code === TariffCode.PLUS_YEARLY)

  const monthlyPro = plans?.find((el) => el.code === TariffCode.PRO_MONTHLY)
  const earlyPro = plans?.find((el) => el.code === TariffCode.PRO_YEARLY)

  const [activePlans, setActivePlans] = useState<Plan[]>([])
  const [selectedPlan, setSelectedPlan] = useState<Plan | undefined>()

  const isShowPlus =
    currentPlan?.code === TariffCode.FREE ||
    currentPlan?.code === TariffCode.BAGOODEX_TEST
  const isShowPro =
    currentPlan?.code === TariffCode.PLUS_MONTHLY ||
    currentPlan?.code === TariffCode.PLUS_YEARLY ||
    currentPlan?.code === TariffCode.PRO_MONTHLY

  useEffect(() => {
    if (isShowPlus && monthlyPlus && earlyPlus) {
      setSelectedPlan(earlyPlus)
      setActivePlans([earlyPlus, monthlyPlus])
    }

    if (isShowPro && monthlyPro && earlyPro) {
      setSelectedPlan(earlyPro)
      setActivePlans([earlyPro, monthlyPro])
    }
  }, [plans])

  return (
    <div className={css.content}>
      <div className={css.firstMobileBlock}>
        <img
          width={360}
          height={159}
          alt='Logo'
          src={isShowPlus ? ImagePlus : ImagePro}
          className={css.image}
          draggable={false}
        />

        {isShowPlus ? (
          <div className={css.title}>
            Unlock all AI Features!
            <br />
            Upgrade to Plus
          </div>
        ) : (
          <div className={css.title}>
            Get Unlimited Access!
            <br />
            Upgrade to Pro
          </div>
        )}

        <Space size={16} />

        <div className={css.description}>
          Save time and money with our all-in-one subscription that provides
          everything you need!
        </div>
      </div>

      <Space size={24} />
      <div className={css.plansPanel}>
        {activePlans &&
          activePlans.map((el, index) => (
            <React.Fragment key={el.code}>
              <MobileBillingPlanRow
                selectedPlan={selectedPlan}
                setSelectedPlan={setSelectedPlan}
                currentPlan={currentPlan}
                plan={el}
                key={el.code}
              />
              {index === 0 && <div className={css.divider} />}
            </React.Fragment>
          ))}
      </div>

      <Space size={28} />

      <div className={css.includedTitle}>
        <div className={css.divider} />
        <div>What&apos;s Included</div>
        <div className={css.divider} />
      </div>

      <Space size={10} />

      <div className={css.plansPanel}>
        <PanelItemMobile
          color='gradient'
          boldTitle={'Access to Browser AI Agent'}
          icon={<BrowserAgent width={18} height={18} />}
        />

        <div className={css.divider} />

        <PanelItemMobile
          color='blue'
          boldTitle={isShowPlus ? 'Advanced AI Search' : 'Unlimited AI Search'}
          icon={<SearchIcon width={20} height={20} />}
        />

        <div className={css.divider} />

        <PanelItemMobile
          color='green'
          boldTitle={isShowPlus ? 'Advanced AI Chat' : 'Unlimited AI Chat'}
          icon={<ChatIcon width={20} height={20} />}
        />

        <div className={css.divider} />

        <PanelItemMobile
          color='violet'
          boldTitle={
            isShowPlus ? 'Advanced Text Writing' : 'Unlimited Text Writing'
          }
          icon={<TextGenerationIcon width={20} height={20} />}
        />

        <div className={css.divider} />

        <PanelItemMobile
          color='orange'
          boldTitle={
            isShowPlus
              ? '10x more Image Generations'
              : 'Unlimited Image Generations'
          }
          icon={<ImageIcon width={20} height={20} />}
        />

        <div className={css.divider} />

        <PanelItemMobile
          color='blue'
          boldTitle={
            isShowPlus
              ? 'Limited File Uploads & Analysing'
              : 'Unlimited File Uploads & Analysing'
          }
          icon={<IconPlus width={20} height={20} />}
        />

        <div className={css.divider} />

        <PanelItemMobile
          color='black'
          boldTitle={'Access to DeepResearch'}
          icon={<IconMicroscope width={20} height={20} />}
        />

        <div className={css.divider} />

        <PanelItemMobile
          color='blue'
          boldTitle={'Opportunities to test new features'}
          icon={<IconMedal width={20} height={20} />}
        />
      </div>

      <Space size={48} />

      <div className={css.fixedButton}>
        <BillingButtonItem
          onDowngrade={handleDowngrade}
          onUpdate={handleUpgrade}
          plan={selectedPlan}
          currentPlan={currentPlan}
          isMobile
        />
      </div>
    </div>
  )
}

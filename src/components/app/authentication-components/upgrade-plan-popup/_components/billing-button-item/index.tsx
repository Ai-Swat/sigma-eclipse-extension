import { Plan, TariffCode } from 'src/store/types'
import BaseButton from 'src/components/ui/base-button'
import styles from './styles.module.css'
import cn from 'clsx'

export function BillingButtonItem({
  currentPlan,
  plan,
  onUpdate,
  onDowngrade,
  isMobile,
  openConfirmationPopup,
}: {
  currentPlan?: { code: TariffCode }
  plan: Plan | undefined
  onUpdate: (id: string) => void
  onDowngrade: (id: string) => void
  isMobile?: boolean
  openConfirmationPopup?: () => void
}) {
  const myPlanCode = currentPlan?.code
  const isCurrentPlan = myPlanCode === plan?.code

  const isFreePlan = plan?.code === TariffCode.FREE
  const isPlus =
    plan?.code === TariffCode.PLUS_YEARLY ||
    plan?.code === TariffCode.PLUS_MONTHLY

  const isMyPlanFree = myPlanCode === TariffCode.FREE
  const isMyPlanTest = myPlanCode === TariffCode.BAGOODEX_TEST

  const isNeedUpgrade =
    isMyPlanFree ||
    (myPlanCode === TariffCode.PLUS_MONTHLY &&
      (plan?.code === TariffCode.PLUS_YEARLY ||
        plan?.code === TariffCode.PRO_MONTHLY ||
        plan?.code === TariffCode.PRO_YEARLY)) ||
    (myPlanCode === TariffCode.PRO_MONTHLY &&
      plan?.code === TariffCode.PRO_YEARLY) ||
    (myPlanCode === TariffCode.PLUS_YEARLY &&
      (plan?.code === TariffCode.PRO_YEARLY ||
        plan?.code === TariffCode.PRO_MONTHLY))

  const isNeedDowngrade =
    isFreePlan ||
    (myPlanCode === TariffCode.PRO_YEARLY &&
      (plan?.code === TariffCode.PRO_MONTHLY ||
        plan?.code === TariffCode.PLUS_MONTHLY ||
        plan?.code === TariffCode.PLUS_YEARLY)) ||
    (myPlanCode === TariffCode.PRO_MONTHLY &&
      (plan?.code === TariffCode.PLUS_MONTHLY ||
        plan?.code === TariffCode.PLUS_YEARLY)) ||
    (myPlanCode === TariffCode.PLUS_YEARLY &&
      plan?.code === TariffCode.PLUS_MONTHLY)

  const tariffId = () => {
    const code = plan?.code.toLowerCase()
    let res = 'code_id_'
    if (code?.includes('plus')) res += 'plus'
    if (code?.includes('pro')) res += 'pro'
    if (plan?.renewal === 'yearly') res += '_yearly'
    if (plan?.renewal === 'monthly') res += '_monthly'
    if (!code?.includes('pro') && !code?.includes('plus')) res += 'free'

    return res
  }
  const id = tariffId()
  const onPlanDowngrade = () => {
    if (plan?.code === TariffCode.FREE && openConfirmationPopup) {
      openConfirmationPopup()
      return
    }

    if (plan?.id) onDowngrade(plan.id)
  }

  if (isMyPlanTest)
    return (
      <BaseButton
        isDisabled
        color={isPlus && !isMobile ? 'white' : 'black'}
        size={isMobile ? 'm' : 'l'}
        className={cn(styles.button, {
          [styles.popularShadow]: isPlus && !isMobile,
        })}
        id='test-plan'
      >
        Subscribe
      </BaseButton>
    )

  if (isCurrentPlan) {
    return (
      <BaseButton
        isDisabled
        isDisabledStyles
        size={isMobile ? 'm' : 'l'}
        className={cn(styles.button, {
          [styles.popularLight]: isPlus && !isMobile,
        })}
        id={id}
      >
        Current plan
      </BaseButton>
    )
  }

  if (isNeedDowngrade) {
    return (
      <BaseButton
        onClick={onPlanDowngrade}
        color='grey'
        size={isMobile ? 'm' : 'l'}
        className={cn(styles.button, {
          [styles.popularLight]: isPlus && !isMobile,
        })}
        id={id}
        data-gtm={plan?.code}
      >
        Downgrade
      </BaseButton>
    )
  }

  if (isNeedUpgrade) {
    return (
      <BaseButton
        onClick={() => {
          if (plan?.code) onUpdate(plan?.id)
        }}
        color={isPlus && !isMobile ? 'white' : 'black'}
        size={isMobile ? 'm' : 'l'}
        id={id}
        className={cn(styles.button, {
          [styles.popularShadow]: isPlus && !isMobile,
        })}
        data-gtm={plan?.code}
      >
        Subscribe
      </BaseButton>
    )
  }
}

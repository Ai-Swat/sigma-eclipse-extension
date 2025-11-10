import { useSearchStore } from 'src/store'
import { Plan, TariffCode } from 'src/store/types'
import { Badge } from 'src/components/ui/badge'
import { RadioBox } from 'src/components/ui/radio-box'
import css from './styles.module.css'

export function MobileBillingPlanRow(props: {
  plan: Plan
  selectedPlan: Plan | undefined
  setSelectedPlan: (item: Plan) => void
  currentPlan?: { code: TariffCode }
}) {
  const { selectedPlan, setSelectedPlan, plan } = props
  const { code, renewal, price } = plan
  const isYearly = renewal === 'yearly'

  const plans = useSearchStore((state) => state.plans)

  const plusMonth = plans?.find((el) => el.code === TariffCode.PLUS_MONTHLY)
  const proMonth = plans?.find((el) => el.code === TariffCode.PRO_MONTHLY)
  const isPlus =
    code === TariffCode.PLUS_YEARLY || code === TariffCode.PLUS_MONTHLY

  const oldPrice = isPlus ? plusMonth!.price * 12 : proMonth!.price * 12

  return (
    <div className={css.panelItem} onClick={() => setSelectedPlan(plan)}>
      <div className={css.innerRow}>
        <RadioBox
          onChange={() => setSelectedPlan(plan)}
          checked={selectedPlan?.code === plan?.code}
          name={'plan'}
          value={selectedPlan}
        />
        <div className={css.column}>
          {isYearly ? (
            <div className={css.row}>
              <span className={css.bold}>Annual</span>
              <Badge>-20%</Badge>
            </div>
          ) : (
            <div>
              <span className={css.bold}>Monthly</span>
            </div>
          )}

          {isYearly && (
            <div className={css.row}>
              <div className={css.oldPrice}>${oldPrice}/year</div>
              <div>${price}/year</div>
            </div>
          )}
        </div>
      </div>

      <div>${isYearly ? price / 12 : price}/monthly</div>
    </div>
  )
}

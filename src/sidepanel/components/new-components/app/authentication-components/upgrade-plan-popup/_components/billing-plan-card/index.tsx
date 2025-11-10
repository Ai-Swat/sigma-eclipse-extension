import cn from 'clsx'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { Plan, TariffCode } from 'src/store/types'
import { WhiteBadge } from 'src/components/ui/badge'
import { BillingButtonItem } from '../billing-button-item'
import IconCheck from 'src/images/check-icon.svg?react'

import styles from './styles.module.css'

export function BillingCard(props: {
  plan: Plan
  handleDowngrade: (id: string) => void
  handleUpgrade: (id: string) => void
  openConfirmationPopup: () => void
}) {
  const { name, code, renewal, price } = props.plan
  const { handleDowngrade, handleUpgrade, openConfirmationPopup } = props
  const isYearly = renewal === 'yearly'
  const isFree = code === TariffCode.FREE

  const { plans, user } = useSearchStore(
    useShallow((state) => ({
      plans: state.plans,
      user: state.user,
    }))
  )

  const currentPlan = user?.subscription?.plan_name && {
    code: user?.subscription?.plan_name,
  }

  const plusMonth = plans?.find((el) => el.code === TariffCode.PLUS_MONTHLY)
  const proMonth = plans?.find((el) => el.code === TariffCode.PRO_MONTHLY)
  const isPro =
    code === TariffCode.PRO_YEARLY || code === TariffCode.PRO_MONTHLY
  const isPlus =
    code === TariffCode.PLUS_YEARLY || code === TariffCode.PLUS_MONTHLY

  return (
    <div className={cn(styles.card, { [styles.popularCard]: isPlus })}>
      {isPlus && (
        <div className={cn(styles.badge, styles.popularBadge)}>
          <div>Popular</div>
        </div>
      )}

      {isPro && (
        <div className={cn(styles.badge, styles.noLimitsBadge)}>
          <div>No Limits</div>
        </div>
      )}

      <div className={styles.column}>
        <div>
          <div className={styles.title}>{name}</div>
        </div>

        <div className={styles.price}>
          {isYearly && (
            <div
              className={cn(styles.oldPrice, { [styles.popularCard]: isPlus })}
            >
              <div>
                $
                {code === TariffCode.PLUS_YEARLY
                  ? plusMonth?.price
                  : proMonth?.price}
              </div>
            </div>
          )}
          <div className={styles.mainPrice}>
            ${isYearly ? price / 12 : price}
          </div>
          <div
            className={cn(styles.renewalPrice, {
              [styles.popularCard]: isPlus,
            })}
          >
            / {renewal === 'free' ? 'forever' : 'per month'}
          </div>
        </div>
      </div>

      <div className={styles.button}>
        <BillingButtonItem
          onDowngrade={handleDowngrade}
          onUpdate={handleUpgrade}
          plan={props.plan}
          currentPlan={currentPlan}
          openConfirmationPopup={openConfirmationPopup}
        />
      </div>

      <div
        className={cn(styles.list, {
          [styles.popularCard]: isPlus,
          [styles.bolder]: isPro,
        })}
      >
        {isFree && (
          <>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>Basic AI Search</div>
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>Basic AI Chat</div>
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>Basic Text Writing</div>
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>5 Image Generations</div>
            </div>
          </>
        )}

        {isPlus && (
          <>
            <div>
              <IconCheck
                className={styles.iconPopular}
                width={18}
                height={18}
              />
              <div>
                Limited access to{' '}
                <span className={styles.boldText}>Browser AI Agent</span>
              </div>
              <WhiteBadge text='Soon' color='white' />
            </div>
            <div>
              <IconCheck
                className={styles.iconPopular}
                width={18}
                height={18}
              />
              <div>
                Advanced AI Search, AI Chat, <br />
                Text Writing
              </div>
            </div>
            <div>
              <IconCheck
                className={styles.iconPopular}
                width={18}
                height={18}
              />
              <div>100 Image Generations</div>
            </div>
            <div>
              <IconCheck
                className={styles.iconPopular}
                width={18}
                height={18}
              />
              <div>100 Telegram Searches</div>
              <WhiteBadge text='Beta' color='white' />
            </div>
            <div>
              <IconCheck
                className={styles.iconPopular}
                width={18}
                height={18}
              />
              <div>100 File Uploads & Analysing</div>
            </div>
            <div>
              <IconCheck
                className={styles.iconPopular}
                width={18}
                height={18}
              />
              <div>Access to DeepResearch</div>
            </div>
            <div>
              <IconCheck
                className={styles.iconPopular}
                width={18}
                height={18}
              />
              <div>Opportunities to test new features</div>
            </div>
          </>
        )}

        {isPro && (
          <>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>
                Access to{' '}
                <span className={styles.gradientText}>Browser AI Agent</span>
              </div>
              <WhiteBadge text='Soon' />
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>
                Unlimited AI Search, AI Chat,
                <br />
                Text Writing, Image Generation
              </div>
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>Unlimited Telegram Searches</div>
              <WhiteBadge text='Beta' />
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>Unlimited File Uploads & Analysing</div>
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>Access to DeepResearch</div>
            </div>
            <div>
              <IconCheck className={styles.icon} width={18} height={18} />
              <div>Opportunities to test new features</div>
            </div>
          </>
        )}
      </div>

      {/*{isPlus && (*/}
      {/*  <>*/}
      {/*    <div className={styles.limitsLink}>*/}
      {/*      Limits apply*/}
      {/*      /!*<Link to={'/'}>Limits apply</Link>*!/*/}
      {/*    </div>*/}
      {/*  </>*/}
      {/*)}*/}
    </div>
  )
}

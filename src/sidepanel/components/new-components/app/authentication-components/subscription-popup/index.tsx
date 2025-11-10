import { useEffect, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import cn from 'clsx'

import { useSearchStore } from 'src/store'
import { TariffCode } from 'src/store/types'

import { Space } from 'src/components/ui/space'
import { Popup, PopupProps } from 'src/components/ui/popup'
import { UpgradePlanButton } from 'src/components/app/app-buttons/upgrade-plan-button'
import BaseButton from 'src/components/ui/base-button'
import IconArrowUpRight from 'src/images/arrow-up-right.svg?react'
import { useSettingsStore } from 'src/store/settings'

import css from './styles.module.css'

export default function SubscriptionPopup({ visible, onClose }: PopupProps) {
  // const [isActive, setIsActive] = useState(true)
  const { user, getBillingPortal } = useSearchStore(
    useShallow((state) => ({
      user: state.user,
      getBillingPortal: state.getBillingPortal,
    }))
  )
  const subscription = user?.subscription
  const dateString =
    subscription?.end_date &&
    new Date(subscription?.end_date).toLocaleDateString()
  const isFree = subscription?.plan_name === TariffCode.FREE
  const [invoicesLink, setInvoicesLink] = useState('')
  const isExtension = useSettingsStore((state) => state.isExtension)

  const subscriptionTitle = () => {
    if (subscription?.plan_name === TariffCode.PLUS_MONTHLY)
      return 'Plus, $10/month'
    if (subscription?.plan_name === TariffCode.PLUS_YEARLY)
      return 'Plus, $96/year'
    if (subscription?.plan_name === TariffCode.PRO_MONTHLY)
      return 'Pro, $75/month'
    if (subscription?.plan_name === TariffCode.PRO_YEARLY)
      return 'Pro, $720/year'
    if (subscription?.plan_name === TariffCode.FREE) return 'Free'

    return 'Free'
  }

  const getInvoicesLink = async () => {
    const url = await getBillingPortal?.()
    if (url?.portal_url) setInvoicesLink(url.portal_url)
  }

  useEffect(() => {
    if (!visible) return

    void getInvoicesLink()
  }, [visible])

  const handleOpenInvoices = async () => {
    if (invoicesLink) window.open(invoicesLink, '_blank')
  }

  const isShowUpgradePlanButton =
    user?.subscription &&
    user?.subscription?.plan_name !== TariffCode.PRO_YEARLY

  const content = (
    <>
      <div
        className={cn(css.column, {
          [css.columnExtension]: isExtension,
        })}
      >
        {!isExtension && <Space size={16} />}

        <div
          className={cn(css.divider, css.firstDivider, {
            [css.firstDividerExtension]: isExtension,
          })}
        />

        <div className={css.firstBlock}>
          <div className={css.column}>
            <div className={css.title}>
              Plan: <span className={css.black}>{subscriptionTitle()}</span>
            </div>
            <Space size={12} />

            <div className={css.smallColumn}>
              <div className={css.textSecondary}>
                Image Generations:{' '}
                <span className={css.black}>
                  {user?.image_gen_limit.current}/
                  {user?.image_gen_limit.remaining}
                </span>
              </div>
              <div className={css.textSecondary}>
                Telegram Searches:{' '}
                <span className={css.black}>
                  {user?.social_search_limit.current}/
                  {user?.social_search_limit.remaining}
                </span>
              </div>
              <div className={css.textSecondary}>
                File Uploading:{' '}
                <span className={css.black}>
                  {user?.file_gen_limit?.current}/
                  {user?.file_gen_limit?.remaining}
                </span>
              </div>
              <div className={css.textSecondary}>
                Deep Research:{' '}
                <span className={css.black}>
                  {user?.deep_research_limit?.current}/
                  {user?.deep_research_limit?.remaining}
                </span>
              </div>
              {user?.web_agent_limit && (
                <div className={css.textSecondary}>
                  Web Agent:{' '}
                  <span className={css.black}>
                    {user?.web_agent_limit?.current}/
                    {user?.web_agent_limit?.remaining}
                  </span>
                </div>
              )}

              {/*<div className={css.textSecondary}>*/}
              {/*  Music Generations: <span className={css.black}>{user?.music_gen_limit.current}/{user?.music_gen_limit.remaining}</span>*/}
              {/*</div>*/}
            </div>
          </div>

          {isShowUpgradePlanButton && <UpgradePlanButton isFullWidthMobile />}
        </div>

        {!isFree && (
          <>
            <div className={css.divider} />

            <div className={css.secondBlock}>
              <div className={css.rowBetween}>
                <div className={css.title}>Expiration date</div>
                <div className={cn(css.title, css.black)}>{dateString}</div>
              </div>

              {/*<div className={css.rowBetween}>*/}
              {/*  <div className={css.title}>*/}
              {/*    Auto top-up*/}
              {/*    <Hint*/}
              {/*      title={'Auto top-up'}*/}
              {/*      text={*/}
              {/*        'Automatically refills your generation credits or balance to keep your workflows running without interruptions'*/}
              {/*      }*/}
              {/*    />*/}
              {/*  </div>*/}
              {/*  <div>*/}
              {/*    <CheckboxToggle*/}
              {/*      onChange={setIsActive}*/}
              {/*      checked={isActive}*/}
              {/*    ></CheckboxToggle>*/}
              {/*  </div>*/}
              {/*</div>*/}
            </div>

            <div className={css.divider} />

            <div className={css.thirdBlock}>
              {/*<div className={css.rowBetweenToColumn}>*/}
              {/*  <div className={css.smallColumn}>*/}
              {/*    <div className={css.title}>Payment method</div>*/}
              {/*    <PaymentMethodItem />*/}
              {/*  </div>*/}

              {/*  <BaseButton color='grey'>*/}
              {/*    Manage*/}
              {/*    <IconArrowUpRight className={css.iconStroke} />*/}
              {/*  </BaseButton>*/}
              {/*</div>*/}

              <div className={css.rowBetweenToColumn}>
                <div className={css.title}>
                  Get Invoice or search through invoices
                </div>
                <BaseButton color='grey' onClick={handleOpenInvoices}>
                  Invoices
                  <IconArrowUpRight className={css.iconStroke} />
                </BaseButton>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  )

  return (
    <Popup
      title={'Subscription'}
      withCloseButton
      visible={visible}
      onClose={onClose}
    >
      {content}
    </Popup>
  )
}

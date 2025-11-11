import { useEffect, useState } from 'react'
import { capitalize } from 'src/libs/coxy-utils'
import { clsx } from 'clsx'
import loadable from '@loadable/component'
import { useShallow } from 'zustand/react/shallow'

import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'
import { useClipboard } from 'src/libs/use/use-clipboard'
import { useThemeContext } from 'src/contexts/themeContext'

import { Popup, PopupProps } from 'src/components/ui/popup'
import { Loader } from 'src/components/ui/loader'
import { Space } from 'src/components/ui/space'
import BaseButton from 'src/components/ui/base-button'
import CheckIcon from 'src/images/check-icon.svg?react'
import SmallSparkLightImage from './images/small-spark-light.png'
import SmallSparkDarkImage from './images/small-spark-dark.png'
import SparkLightImage from './images/spark-light.png'
import SparkDarkImage from './images/spark-dark.png'
import UsersLightImage from './images/user-light.png'
import UsersDarkImage from './images/user-dark.png'

import css from './styles.module.css'

const RedeemCodePopup = loadable(
  () => import('src/components/app/authentication-components/redeem-code-popup')
)

export const REDEEM_POINTS = 500
export const TOKENS_NAME = 'tokens'

function LabelBlock({ value, label }: { value: string; label: string }) {
  const [copy, isCopied] = useClipboard()
  return (
    <div className={css.labelBlock}>
      <div className={css.label}>Share your invitation {label}</div>
      <div className={css.inputRow}>
        <div className={css.input}>
          {value ? <span>{value}</span> : <Loader size={20} color='black' />}
        </div>
        <BaseButton
          onClick={() => copy(value)}
          color='black'
          className={css.button}
        >
          {isCopied ? (
            <CheckIcon width={20} height={20} className={css.icon} />
          ) : (
            'Copy'
          )}
        </BaseButton>
      </div>
    </div>
  )
}

export default function ReferralPopup({ visible, onClose }: PopupProps) {
  const { theme } = useThemeContext()
  const isDark = theme === 'dark'

  const isExtension = useSettingsStore((state) => state.isExtension)
  const { referralData, generateReferralCode, getMyReferralData } =
    useSearchStore(
      useShallow((state) => ({
        referralData: state.referral_data,
        generateReferralCode: state.generateReferralCode,
        getMyReferralData: state.getMyReferralData,
      }))
    )

  const [isOpen, setIsOpen] = useState(false)
  const code = referralData?.referral_code || ''
  const link = `https://sigmabrowser.com/referral?code=${code}`
  const points = referralData?.points || '0'
  const referralsCount = referralData?.referrals_count || '0'

  const handleRedeemCode = () => {
    if (!referralData) return
    setIsOpen(true)
  }

  useEffect(() => {
    if (!visible) return
    if (!referralData) {
      // если первый раз заходит генерируем код
      generateReferralCode()
      return
    }
    // просто запрашиваем информацию о рефералке
    getMyReferralData()
  }, [visible])

  const content = (
    <div className={css.column}>
      <div className={clsx(css.titleBlock, { [css.isExtension]: isExtension })}>
        <div>
          <img
            src={isDark ? SparkDarkImage : SparkLightImage}
            width={72}
            height={72}
            className={css.image}
            draggable={false}
            alt=''
          />
        </div>
        <div>Invite to get Sigma AI {capitalize(TOKENS_NAME)}</div>
        <div>
          Share your invitation code with
          <br />
          friends, get {REDEEM_POINTS} {TOKENS_NAME} each
        </div>
      </div>

      <div className='w-100p'>
        <LabelBlock label='code' value={code} />
        <Space size={20} />
        <LabelBlock label='link' value={link} />
      </div>

      <div className={css.infoBlock}>
        <div className={css.rowFirst}>
          <div className={css.divider} />
          <div className={css.label}>Your Balance</div>
          <div className={css.divider} />
        </div>
        <div className={css.rowHistory}>
          <div>
            <div>{points}</div>
            <div className='capitalize'>{TOKENS_NAME}</div>
            <div className={css.image}>
              <img
                src={isDark ? SmallSparkDarkImage : SmallSparkLightImage}
                width={40}
                height={40}
                draggable={false}
                alt=''
              />
            </div>
          </div>
          <div>
            <div>{referralsCount}</div>
            <div>Referral</div>
            <div className={css.image}>
              <img
                src={isDark ? UsersDarkImage : UsersLightImage}
                width={40}
                height={40}
                draggable={false}
                alt=''
              />
            </div>
          </div>
        </div>
      </div>

      <div className={css.footer}>
        <div className={css.link} onClick={handleRedeemCode}>
          Redeem Code
        </div>
        <span>·</span>
        <a
          href={'https://sigmabrowser.com/sigma-token'}
          target={'_blank'}
          className={css.link}
          rel='noreferrer'
        >
          About Token
        </a>
      </div>
    </div>
  )

  return (
    <>
      <Popup
        withCloseButton
        className={css.popup}
        visible={visible}
        onClose={onClose}
      >
        {content}
      </Popup>

      <RedeemCodePopup visible={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}

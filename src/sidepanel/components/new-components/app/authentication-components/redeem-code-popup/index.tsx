import { useCallback, useEffect, useState } from 'react'
import confetti, { Shape } from 'canvas-confetti'
import { capitalize } from 'src/libs/coxy-utils'
import { clsx } from 'clsx'

import { useSearchStore } from 'src/store'
import { addToastError } from 'src/libs/toast-messages'
import useMobileDetect from 'src/libs/use/use-mobile-detect'
import { useThemeContext } from 'src/contexts/themeContext'
import { REDEEM_POINTS, TOKENS_NAME } from '../referral-popup'

import { Popup, PopupProps } from 'src/components/ui/popup'
import { TextInput } from 'src/components/ui/text-input'
import BaseButton from 'src/components/ui/base-button'
import LightImage from './images/img-light.png'
import DarkImage from './images/img-dark.png'
import SuccessLightImage from './images/success-light.png'
import SuccessDarkImage from './images/success-dark.png'

import css from './styles.module.css'

export default function RedeemCodePopup({ visible, onClose }: PopupProps) {
  const { theme } = useThemeContext()
  const isDark = theme === 'dark'
  const isMobile = useMobileDetect()
  const [enteredCode, setEnteredCode] = useState('')
  const [isVisibleError, setIsVisibleError] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)
  const [errorText, setErrorText] = useState('')
  const addReferralByCode = useSearchStore((state) => state.addReferralByCode)
  const referralData = useSearchStore((state) => state.referral_data)
  const referralCode = referralData?.referral_code || ''

  const successConfetti = useCallback(() => {
    const shapes: Shape[] = ['square', 'circle', 'square']
    const particleCount = 1700
    const zIndex = 1000000
    const scalar = 0.7
    const spread = 120
    const startVelocity = 70

    if (isMobile) {
      confetti({
        shapes,
        particleCount,
        spread,
        scalar,
        zIndex,
        angle: -90,
        origin: { x: 0.5, y: -0.5 },
        gravity: 0.5,
        startVelocity: 55,
      })
      return
    }

    confetti({
      shapes,
      particleCount,
      spread,
      scalar,
      zIndex,
      startVelocity,
      angle: 60,
      origin: { x: 0, y: 1.2 },
    })
    confetti({
      shapes,
      particleCount,
      spread,
      scalar,
      zIndex,
      startVelocity,
      angle: 120,
      origin: { x: 1, y: 1.2 },
    })
  }, [isMobile])

  useEffect(() => {
    if (!visible) {
      setEnteredCode('')
    }
    setIsVisibleError(false)
    setErrorText('')
    setIsSuccess(false)
  }, [visible, enteredCode])

  // TODO вернуть
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const handleCode = async () => {
    if (!enteredCode) {
      setIsVisibleError(true)
      setErrorText('Enter Code')
      return
    }

    if (enteredCode === referralCode) {
      setIsVisibleError(true)
      setErrorText('Invalid Code')
      addToastError('You can’t activate your own code')
      return
    }

    const result = await addReferralByCode(enteredCode)

    if (result?.status === 'success') {
      successConfetti()
      setIsSuccess(true)
    } else {
      setIsVisibleError(true)
      addToastError('The code you entered is incorrect. Please try again.')
      setErrorText(result?.message || 'Incorrect Code')
    }
  }

  const successContent = (
    <div className={clsx(css.column, 'opacity-animation')}>
      <div className={css.titleBlock}>
        <img
          src={isDark ? SuccessDarkImage : SuccessLightImage}
          width={96}
          height={96}
          className={css.icon}
          alt=''
        />
        <div>Welcome to the Family!</div>
        <div>
          You&apos;ve earned{' '}
          <span className={css.green}>
            +{REDEEM_POINTS} Sigma {capitalize(TOKENS_NAME)}!
          </span>
          <br />
          Share your referral link and
          <br />
          get even more tokens.
        </div>
      </div>

      <div className={css.buttonBlock}>
        <BaseButton onClick={onClose} size='l' className='w-100p' color='black'>
          Earn More
        </BaseButton>
      </div>
    </div>
  )

  const content = (
    <div className={css.column}>
      <div className={css.titleBlock}>
        <img
          src={isDark ? DarkImage : LightImage}
          width={96}
          height={96}
          className={css.icon}
          alt=''
        />
        <div>Redeem Code for {TOKENS_NAME}</div>
        <div>Activate invitation or bonus code</div>
      </div>

      <div className={css.buttonBlock}>
        <TextInput
          value={enteredCode}
          onChange={setEnteredCode}
          placeholder={'Enter code'}
          inputClassName={css.input}
          isVisibleError={isVisibleError}
          textError={errorText}
          autoFocus
          onFocus={() => setIsVisibleError(false)}
          id={'redeem-code'}
        />
        <BaseButton
          onClick={successConfetti}
          // TODO вернуть как было
          // onClick={handleCode}
          size='l'
          className='w-100p'
          color='black'
        >
          Redeem Code
        </BaseButton>
      </div>
    </div>
  )

  return (
    <Popup
      withCloseButton
      className={css.popup}
      visible={visible}
      onClose={onClose}
    >
      {isSuccess ? successContent : content}
    </Popup>
  )
}

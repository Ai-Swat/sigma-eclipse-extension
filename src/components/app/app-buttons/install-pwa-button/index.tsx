import { memo, useEffect, useState } from 'react'

import DownloadIcon from 'src/images/download-icon.svg?react'
import BaseButton from 'src/components/ui/base-button'
import { formatDistanceStrict } from 'date-fns'

import css from './styles.module.css'

type PromptEvent = globalThis.Event & {
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed'
    platform: string
  }>
  prompt(): Promise<void>
}

const PROMPT_WAS_SHOWN = 'PROMPT_WAS_SHOWN'

export const InstallPwaButton = memo(
  ({ isShowUpgradePlanButton }: { isShowUpgradePlanButton?: boolean }) => {
    const [promptEvent, setPromptEvent] = useState<PromptEvent | null>(null)
    const [isShowButton, setIsShowButton] = useState(false)
    const [isShowAlert, setIsShowAlert] = useState(false)
    const [doNotShowPrompt, setDoNotShowPrompt] = useState(true)

    const checkIsWeekPassed = (date: string) => {
      const days = formatDistanceStrict(new Date(), new Date(date), {
        unit: 'day',
        addSuffix: false,
      })
      return +days.split(' ')[0] >= 7
    }

    useEffect(() => {
      const isStandalone = window.matchMedia(
        '(display-mode: standalone)'
      ).matches
      const promptWasShown = localStorage?.getItem(PROMPT_WAS_SHOWN)
      const isWeekPassed = promptWasShown && checkIsWeekPassed(promptWasShown)
      const doNotShowPrompt = isStandalone

      setDoNotShowPrompt(doNotShowPrompt)

      if (doNotShowPrompt) return

      const promptListener = (e: globalThis.Event) => {
        try {
          setPromptEvent(e as PromptEvent)
          setIsShowButton(true)

          if (isWeekPassed || !promptWasShown) setIsShowAlert(true)
        } catch {
          /* empty */
        }
      }

      window.addEventListener('beforeinstallprompt', promptListener)

      return () => {
        window.removeEventListener('beforeinstallprompt', promptListener)
      }
    }, [isShowAlert])

    const handleCloseAlert = () => {
      localStorage.setItem(PROMPT_WAS_SHOWN, new Date().toString())
      setIsShowAlert(false)
    }

    const handleInstall = async () => {
      // Делаем функцию асинхронной
      try {
        handleCloseAlert()

        if (!promptEvent) {
          // Явная проверка
          throw new Error('PWA prompt event not available')
        }

        await promptEvent.prompt() // Без optional chaining
        const choiceResult = await promptEvent.userChoice // Ждём результат

        if (choiceResult.outcome === 'accepted') {
          setPromptEvent(null)
        }
      } catch (ignore) {
        // ignore
      }
    }

    if (doNotShowPrompt) return null
    if (!isShowButton) return null
    if (isShowUpgradePlanButton) return null

    return (
      <div className='relative hide-mobile'>
        <BaseButton
          color={'black'}
          size={'default'}
          className={css.button}
          onClick={handleInstall}
          id={'install-pwa-id'}
        >
          <BaseButton.Icon>
            <DownloadIcon width={18} height={18} className={css.icon} />
          </BaseButton.Icon>
          <span className={css.text}>Install</span>
        </BaseButton>

        {/*{isShowAlert && <InstallTooltip onClose={handleCloseAlert} />}*/}
      </div>
    )
  }
)

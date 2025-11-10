import { useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'
import { sendMessageToExtension } from 'src/libs/send-message-to-extension'
import { useDictateContext } from 'src/contexts/dictateContext'
import { TooltipDefault } from 'src/components/ui/tooltip'
import { LoaderBars } from 'src/components/ui/loader-bars'
import IconMic from 'src/images/icon-mic.svg?react'
import IconClear from 'src/images/clear-icon.svg?react'
import css from './styles.module.css'

export function DictateButton({ onClick }: { onClick?: () => void }) {
  const { isWidget, isExtension } = useSettingsStore(
    useShallow((state) => ({
      isWidget: state.isWidget,
      isExtension: state.isExtension,
    }))
  )
  const { is_log_in, user } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
    }))
  )
  const isLogIn = Boolean(is_log_in && user)
  const { isRecording, startRecording, stopAndClearRecording } =
    useDictateContext()
  const isCancelButton = isRecording
  const [isLoading, setIsLoading] = useState(false)

  if (isWidget || !isLogIn) return null

  if (isCancelButton)
    return (
      <div
        onClick={(event) => {
          event.stopPropagation()
          stopAndClearRecording()
        }}
        className={css.clearWrapper}
      >
        <IconClear width={20} height={20} className={css.clearIcon} />
      </div>
    )

  return (
    <div
      onClick={async (event) => {
        event.stopPropagation()
        onClick?.()
        if (isExtension) {
          setIsLoading(true)
          void sendMessageToExtension('GET_MIC_PERMISSION', isExtension)
        }
        await startRecording()
        setIsLoading(false)
      }}
      className={css.wrapper}
    >
      {isLoading ? (
        <LoaderBars color='black' />
      ) : (
        <TooltipDefault text={'Dictate'}>
          <div className='relative'>
            <IconMic width={20} height={20} className={css.icon} />
          </div>
        </TooltipDefault>
      )}
    </div>
  )
}

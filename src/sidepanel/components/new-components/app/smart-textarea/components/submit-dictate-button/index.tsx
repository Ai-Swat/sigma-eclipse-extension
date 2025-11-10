import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { useDictateContext } from 'src/contexts/dictateContext'
import { LoaderBars } from 'src/components/ui/loader-bars'
import IconCheck from 'src/images/check-icon.svg?react'
import css from './styles.module.css'

export function SubmitDictateButton() {
  const { is_log_in, user } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
    }))
  )
  const isLogIn = Boolean(is_log_in && user)
  const { isLoadingVoiceFile, uploadAndClearRecording } = useDictateContext()

  if (!isLogIn) return null

  return (
    <>
      {isLoadingVoiceFile ? (
        <div className={css.wrapper}>
          <LoaderBars color='white' />
        </div>
      ) : (
        <div
          className={css.wrapper}
          onClick={(event) => {
            event.stopPropagation()
            uploadAndClearRecording()
          }}
        >
          <IconCheck width={24} height={24} className={css.icon} />
        </div>
      )}
    </>
  )
}

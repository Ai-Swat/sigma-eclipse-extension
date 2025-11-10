import { useCallback, useMemo } from 'react'
import { useLocation } from 'react-router-dom'
import cn from 'clsx'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import NewThreadButton from 'src/components/app/sidebar/_components/new-thread-button'
import { ProfileItem } from 'src/components/app/authentication-components/profile-item'
import { HistoryButton } from './components/history-button'
import { TEXTAREA_ID_EXTENSION } from 'src/components/app/smart-textarea/hooks/utils'
import styles from './styles.module.css'

export default function HeaderExtension() {
  const { is_log_in, user } = useSearchStore(
    useShallow((state) => ({
      is_log_in: state.is_log_in,
      user: state.user,
    }))
  )
  const location = useLocation()
  const isMain = location.pathname === '/'
  const isLogIn = Boolean(is_log_in && user)

  const headerCn = useMemo(() => {
    return cn(styles.headerStyles, {
      [styles.noBackground]: isMain,
    })
  }, [isMain])

  const handleFocusTextareaExtension = useCallback(() => {
    const textarea = document.getElementById(TEXTAREA_ID_EXTENSION)
    textarea?.focus()
  }, [])

  return (
    <header className={headerCn}>
      <div />

      <div className={styles.row}>
        <NewThreadButton onOpen={handleFocusTextareaExtension} isExtension />

        <HistoryButton isLogIn={isLogIn} />

        <ProfileItem />
      </div>
    </header>
  )
}

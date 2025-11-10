import { memo, useMemo } from 'react'
import clsx from 'clsx'
import { Link, useLocation } from 'react-router-dom'
import { useSearchStore } from 'src/store'
import HistoryIconExtension from 'src/images/history-icon-extension.svg?react'
import BaseButton from 'src/components/ui/base-button'
import { Loader } from 'src/components/ui/loader'
import { TooltipDefault } from 'src/components/ui/tooltip'
import styles from './styles.module.css'

function HistoryButtonComponent({ isLogIn }: { isLogIn: boolean }) {
  const location = useLocation()
  const activeAgentThreads = useSearchStore((state) => state.activeAgentThreads)
  const activeAgentThreadsLength = useMemo(
    () => activeAgentThreads.length,
    [activeAgentThreads.length]
  )

  const isHistory = location.pathname === '/history'
  const isSearchPage = location.pathname === '/search'
  const isLoaderButton = isSearchPage && activeAgentThreadsLength >= 1

  return (
    <TooltipDefault text='Open history'>
      <div className='relative'>
        {isLogIn ? (
          <Link to={'/history'}>
            <BaseButton
              color='transparent-hover'
              iconColor='icon-disabled'
              className={clsx(styles.button, {
                [styles.activeButton]: isHistory,
                [styles.isLoaderButton]: isLoaderButton,
              })}
            >
              {isLoaderButton ? (
                <>
                  <Loader strokeWidth={9} size={18} className={styles.loader} />
                  <span className={styles.text}>
                    {activeAgentThreadsLength}
                  </span>
                </>
              ) : (
                <HistoryIconExtension
                  width={18}
                  height={18}
                  className={styles.icon}
                />
              )}
            </BaseButton>
          </Link>
        ) : (
          <BaseButton color='transparent-hover' iconColor='icon-disabled'>
            <HistoryIconExtension
              width={18}
              height={18}
              className={styles.iconDisabled}
            />
          </BaseButton>
        )}
      </div>
    </TooltipDefault>
  )
}

export const HistoryButton = memo(HistoryButtonComponent)

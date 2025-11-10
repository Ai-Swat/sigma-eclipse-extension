import { memo, useCallback, useRef, useState } from 'react'
import { clsx } from 'clsx'
import { useNavigate } from 'react-router-dom'

import { useSearchStore } from 'src/store'
import useClickOutside from 'src/libs/use/use-click-outside'

import ArrowUpIcon from 'src/images/chevron.svg?react'
import { Loader } from 'src/components/ui/loader'
import { TaskItem } from './task-item'
import { TaskStatusIcon } from './task-status-icon'

import styles from './styles.module.css'

function TasksProgressBarComponent() {
  const activeAgentThreads = useSearchStore((state) => state.activeAgentThreads)

  const navigate = useNavigate()
  const closeDropdown = useCallback(() => setOpen(false), [])
  const innerRef = useRef<HTMLDivElement | null>(null)
  const [isOpen, setOpen] = useState(false)

  const hasMultipleActiveAgents = activeAgentThreads.length > 1

  const firstThread = activeAgentThreads?.[0]
  const firstThreadName = firstThread?.thread_name || firstThread?.query
  const firstThreadLink =
    (firstThread?.hash || firstThread?.thread_id) &&
    `/search?id=${firstThread?.hash || firstThread?.thread_id}`
  const firstThreadIsPaused =
    firstThread?.is_clarification_requested ||
    firstThread?.is_agent_reply_requested
  const firstThreadIsDone = firstThread?.is_finished
  const firstThreadIsFailed = firstThread?.is_failed

  useClickOutside(innerRef, closeDropdown)

  if (!activeAgentThreads.length) return null

  return (
    <div
      ref={innerRef}
      className={clsx(styles.wrapper, 'opacity-animation', {
        [styles.isOpen]: isOpen,
      })}
    >
      <div
        onClick={() => {
          if (hasMultipleActiveAgents) setOpen((prevState) => !prevState)
          else if (firstThreadLink) navigate(firstThreadLink)
        }}
        className={clsx(styles.header, { [styles.isOpen]: isOpen })}
      >
        {hasMultipleActiveAgents ? (
          <span>{activeAgentThreads.length} Tasks in Progress</span>
        ) : (
          <span>{firstThreadName}</span>
        )}

        <div className={styles.innerBlock}>
          {!isOpen && (
            <>
              {hasMultipleActiveAgents ? (
                <Loader className={styles.loader} strokeWidth={9} size={18} />
              ) : (
                <TaskStatusIcon
                  isPaused={firstThreadIsPaused}
                  isDone={firstThreadIsDone}
                  isFailed={firstThreadIsFailed}
                />
              )}
            </>
          )}

          {hasMultipleActiveAgents && (
            <ArrowUpIcon
              className={clsx(styles.iconArrow, {
                [styles.iconRotate]: isOpen,
              })}
            />
          )}
        </div>
      </div>

      {isOpen && (
        <>
          <div
            className={clsx(styles.list, {
              [styles.longList]: activeAgentThreads.length > 5,
            })}
          >
            {activeAgentThreads.map((item) => (
              <TaskItem key={item.id} item={item} />
            ))}
          </div>

          {activeAgentThreads.length > 5 && (
            <div className={styles.gradientFooter} />
          )}
        </>
      )}
    </div>
  )
}

export const TasksProgressBar = memo(TasksProgressBarComponent)

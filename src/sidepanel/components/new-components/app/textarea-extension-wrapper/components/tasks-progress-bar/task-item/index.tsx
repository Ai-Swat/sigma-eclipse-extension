import { memo } from 'react'
import { Link } from 'react-router-dom'
import { UserHistoryItem } from 'src/store/types'
import { TaskStatusIcon } from '../task-status-icon'
import styles from './styles.module.css'

function TaskItemComponent({ item }: { item: Partial<UserHistoryItem> }) {
  const link =
    (item?.hash || item?.thread_id) &&
    `/search?id=${item.hash || item?.thread_id}`
  const isPaused =
    item.is_clarification_requested || item.is_agent_reply_requested
  const isDone = item.is_finished
  const isFailed = item.is_failed

  if (!link) return null

  return (
    <Link to={link} className={styles.item}>
      <div className={styles.title}>{item?.thread_name || item?.query}</div>
      <TaskStatusIcon isPaused={isPaused} isDone={isDone} isFailed={isFailed} />
    </Link>
  )
}

export const TaskItem = memo(TaskItemComponent)

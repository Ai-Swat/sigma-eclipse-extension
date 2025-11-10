import { useEffect, useState } from 'react'
import BaseButton from 'src/components/ui/base-button'
import { useSearchStore } from 'src/store'
import cn from 'clsx'
import styles from './styles.module.css'

export function AgentRequest({
  followup_id,
  thread_id,
  followUpIsAgentReplyRequested,
}: {
  followup_id?: string
  thread_id?: string
  followUpIsAgentReplyRequested?: boolean
}) {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (followUpIsAgentReplyRequested) setIsOpen(true)
  }, [followUpIsAgentReplyRequested])


  if (!isOpen || !followUpIsAgentReplyRequested) return null

  return (
    <div className={cn(styles.wrapper, 'fade-in')}>
      <div className={styles.text}>
        <div>Looks like AI Agent Request</div>
        <div>
          Start task? The agent runs one at a time and will notify you when done
        </div>
      </div>
      <div className={styles.buttons}>
        <BaseButton
          onClick={() => {}}
          color='black'
          className={styles.button}
        >
          Continue
        </BaseButton>
        <BaseButton
          onClick={() => {}}
          color='grey'
          className={styles.button}
        >
          Cancel
        </BaseButton>
      </div>
    </div>
  )
}

import React, { PropsWithChildren } from 'react'
import { AgentRequest } from './components/agent-request'
import { JumpToLiveItem } from './components/jump-to-live-item'
import { TabInfoHeader } from './components/tab-info-block'
import { TasksProgressBar } from './components/tasks-progress-bar'

type TextareaExtensionWrapperProps = PropsWithChildren & {
  isMainPage?: boolean

  followup_id?: string
  thread_id?: string
  followUpIsAgentReplyRequested?: boolean
  isFollowUpInput?: boolean
  isEnd?: boolean
  taskId?: string
}

const TextareaExtensionWrapper = ({
  isMainPage,
  followup_id,
  thread_id,
  followUpIsAgentReplyRequested,
  isFollowUpInput,
  isEnd,
  taskId,
  children,
}: TextareaExtensionWrapperProps) => {
  const isJumpToLive =
    isFollowUpInput &&
    !followUpIsAgentReplyRequested &&
    !isEnd

  return (
    <div className='w-100p'>

      {isJumpToLive && !isMainPage && <JumpToLiveItem taskId={taskId} />}

      {isMainPage && <TasksProgressBar />}

      <TabInfoHeader />

      {children}
    </div>
  )
}

export default React.memo(TextareaExtensionWrapper)

import { useEffect, useRef } from 'react'
import { FollowUpType, TypeFollowUp } from 'src/store/types'
import { useSearchStore } from 'src/store'
import { useEvent } from 'src/libs/use/use-event'
import { useSearchHandler } from 'src/libs/use/use-search-handler'
import { useGoRelated } from 'src/libs/use/use-go-related'
import MessageIcon from 'src/images/message.svg?react'

import css from './styles.module.css'

interface IProps {
  item: Partial<TypeFollowUp>
  isFirst?: boolean
  onClose: () => void
  id: string
}

export function RegenerateWithChatButton({
  item,
  isFirst,
  onClose,
  id,
}: IProps) {
  const deleteFollowUps = useSearchStore((state) => state.deleteFollowUps)
  const { callGoRelated } = useGoRelated()
  const { runSearch } = useSearchHandler()

  // сохраняем item на момент маунта
  const initialItemRef = useRef<Partial<TypeFollowUp>>(item)
  useEffect(() => {
    // только на маунт
    initialItemRef.current = item
  }, [])

  const handleFirstSearch = async (query: string, type: FollowUpType) => {
    if (query.length === 0) return
    await runSearch({ query, type })
  }

  const handleSearch = useEvent(async () => {
    const savedItem = initialItemRef.current

    if (isFirst) window.scrollTo({ top: 0, behavior: 'smooth' })

    // item.id нет когда кончились лимиты
    if (!savedItem.id || isFirst) {
      void handleFirstSearch(savedItem.query || '', FollowUpType.CHAT)
      onClose()
      return
    }

    deleteFollowUps(savedItem)

    void callGoRelated({
      query: savedItem.query || '',
      parent_id: savedItem.parent_id,
      followup_type: FollowUpType.CHAT,
    })

    onClose()
  })

  return (
    <div
      className={css.button}
      onClick={handleSearch}
      id={id + '_REGENERATE_BUTTON'}
    >
      <MessageIcon className={css.icon} />
      Continue with Chat
    </div>
  )
}

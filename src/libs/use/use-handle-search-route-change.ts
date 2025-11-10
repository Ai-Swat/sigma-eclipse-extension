import { useEffect, useRef } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'

import { useSearchStore } from 'src/store'
import { TypeFollowUp } from 'src/store/types'
import { encodeWithSpecialCharacters } from '../utils'
import { useShallow } from 'zustand/react/shallow'
import { addToastError } from 'src/libs/toast-messages'
import { formatTitleForSearch, useSetTitle } from './use-title'
import { useSearchHandler } from './use-search-handler'

export function useHandleSearchRouteChange() {
  const {
    followUps,
    isStartSearch,
    currentSearchQuery,
    fetchCompletedFollowUp,
    thread_name,
    removeActiveAgentThread,
  } = useSearchStore(
    useShallow((state) => ({
      followUps: state.followUps ?? [],
      isStartSearch: state.isStartSearch ?? false,
      currentSearchQuery: state.currentSearchQuery,
      fetchCompletedFollowUp: state.fetchCompletedFollowUp,
      thread_name: state.thread_name,
      removeActiveAgentThread: state.removeActiveAgentThread,
    }))
  )

  const [searchParams] = useSearchParams()
  const nav = useNavigate()
  const setTitle = useSetTitle()
  const { runSearch } = useSearchHandler()

  const prevThreadIdRef = useRef<string | null>(null)
  const navByAppRef = useRef(false) // <--- флаг перехода через nav()

  useEffect(() => {
    if (thread_name) {
      setTitle(formatTitleForSearch(thread_name))
    }
  }, [thread_name])

  useEffect(() => {
    const threadId = searchParams.get('id')
    const searchQuery = searchParams.get('q')

    // когда начали новый тред, записываем его в prevThreadIdRef чтобы не загружать заново
    if (
      followUps?.[0]?.thread_id &&
      !prevThreadIdRef.current &&
      isStartSearch
    ) {
      prevThreadIdRef.current = followUps[0].thread_id
    }

    if (!threadId) {
      prevThreadIdRef.current = null
    }

    // на случай если не завершена загрузка фоллоуапа
    const isNotCompleted =
      followUps &&
      followUps.some((i: Partial<TypeFollowUp>) => !i.end && i.is_not_completed)

    if (isNotCompleted && threadId === followUps[0].thread_id) {
      return
    }

    // если фоллоуап уже был загружен
    if (
      threadId &&
      followUps.length > 0 &&
      currentSearchQuery === encodeWithSpecialCharacters(threadId)
    ) {
      const lastFollowUp = followUps?.at(-1)
      const isEnd = Boolean(lastFollowUp?.is_finished || lastFollowUp?.end)
      if (isEnd) {
        removeActiveAgentThread({
          threadId: lastFollowUp?.thread_id,
          followUpId: lastFollowUp?.id,
        })
      }
      return
    }

    // 3. Если есть ?q= и уже есть followUps → обновляем URL на thread_id
    if (searchQuery && followUps?.[0]?.thread_id && !threadId) {
      navByAppRef.current = true // <-- запоминаем, что мы вызвали nav()
      nav(`?id=${encodeWithSpecialCharacters(followUps[0].thread_id || '')}`, {
        replace: true,
      })
      return
    }

    // 1. Загружаем фоллоуап по threadId (если не навигировали сами)
    if (threadId && prevThreadIdRef.current !== threadId) {
      if (navByAppRef.current) {
        // сбрасываем флаг — мы сами перешли, загрузку фоллоуапа не делаем
        navByAppRef.current = false
        prevThreadIdRef.current = threadId
      }

      prevThreadIdRef.current = threadId

      const loadFollowUp = async () => {
        const res = await fetchCompletedFollowUp(threadId)

        if (res?.status_code === 404) {
          // если не нашли тред идем на главную и выводит ошибку
          nav('/', {
            replace: true,
          })
          addToastError(`Unable to load conversation ${threadId}`)
          return
        }

        // 2. Если нет followUps, выполняем стартовый поиск
        if ((!res?.followUps || res?.followUps.length === 0) && searchQuery) {
          await runSearch({
            query: searchQuery,
            navigateTo: false, // тут навигация не нужна
          })
        }
      }

      void loadFollowUp()
      return
    }

    // 4. Если есть ?q=, но ещё не был запущен поиск
    if (
      searchQuery &&
      !isStartSearch &&
      !currentSearchQuery &&
      !followUps?.[0]
    ) {
      void runSearch({
        query: searchQuery,
        navigateTo: false, // тут навигация не нужна
      })
    }
  }, [
    searchParams,
    isStartSearch,
    currentSearchQuery,
    fetchCompletedFollowUp,
    runSearch,
    nav,
  ])
}

import {
  ChangeEvent,
  KeyboardEvent,
  useCallback,
  useEffect,
  useState,
} from 'react'
import { wait } from 'src/libs/coxy-utils'
import { fetchSuggestions, Option, prepareOptions } from './utils'
import { useEvent } from 'src/libs/use/use-event'
import { debounce } from 'src/libs/debounce'

// Simplified FollowUpType for suggestions
enum FollowUpType {
  SEARCH = 'web-search',
  CHAT = 'text-chat',
  IMAGE = 'image-generation',
  DEEP_RESEARCH = 'deep-research',
}
import {
  DEFAULT_QUESTIONS_CHAT,
  DEFAULT_QUESTIONS_DEEP_RESEARCH,
  DEFAULT_QUESTIONS_IMAGE,
  DEFAULT_QUESTIONS_WEB_SEARCH,
} from './default-suggestions'

export const MAX_OPTIONS_LENGTH = 4
export const CURSOR_START_VALUE = -1

export default function useTextareaSuggestions({
  value,
  onChange,
  onEnter,
  selectedMode,
  isMainPage,
}: {
  value: string
  onChange: (value: string, isSkipFocus?: boolean) => void
  onEnter: (value?: string) => void
  selectedMode: FollowUpType | undefined
  isMainPage?: boolean
}) {
  const [options, setOptions] = useState<Option[]>([])
  const [cursor, setCursor] = useState<number>(CURSOR_START_VALUE)
  const [query, setQuery] = useState(value)
  const [isOpenSuggestions, setIsOpenSuggestions] = useState(false)

  const updateSearchValue = useCallback(
    (newCursor: number) => {
      if (!onChange) return
      if (newCursor === -1 || newCursor === options.length) {
        onChange(query)
      } else if (options[newCursor]) {
        onChange(options[newCursor].label)
      }
    },
    [onChange, options]
  )

  const handleOpenSuggestions = useCallback(() => {
    if (options.length > 0) {
      setIsOpenSuggestions(true)
    }
  }, [options])

  const closeSuggestions = useCallback(() => {
    setIsOpenSuggestions(false)
  }, [])

  const setPreselected = useCallback((index: number) => {
    setCursor(index)
  }, [])

  const onKeyDownInput = useEvent(
    async (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey && onEnter) {
        e.preventDefault()
        onEnter()
        await wait(100)
        closeSuggestions()
      }

      if (!isOpenSuggestions) return

      if (e.key === 'Escape') {
        closeSuggestions()
        return
      }
      if (e.key === 'ArrowDown') {
        e.preventDefault()
        const nextCursor = cursor >= options.length - 1 ? 0 : cursor + 1
        setCursor(nextCursor)
        updateSearchValue(nextCursor)
      }

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        const prevCursor = cursor <= 0 ? options.length - 1 : cursor - 1
        setCursor(prevCursor)
        updateSearchValue(prevCursor)
      }
    }
  )

  const selectOption = useCallback(
    async (option: Option) => {
      await wait(100)
      onEnter(option.label || '')
      closeSuggestions()
    },
    [onEnter, closeSuggestions]
  )

  useEffect(() => {
    if (!isMainPage || isExtension) return

    // убираем подсказки когда нет текста
    if (!value) setOptions([])
    if (value) return

    // меняем подсказки для разных категорий
    const activeModes = [
      FollowUpType.SEARCH,
      FollowUpType.IMAGE,
      FollowUpType.CHAT,
      FollowUpType.DEEP_RESEARCH,
    ]
    if (selectedMode && activeModes.includes(selectedMode)) {
      setIsOpenSuggestions(true)
    } else {
      setIsOpenSuggestions(false)
      setOptions([])
    }
    if (selectedMode === FollowUpType.SEARCH) {
      const items = prepareOptions(DEFAULT_QUESTIONS_WEB_SEARCH)
      setOptions(items)
    }
    if (selectedMode === FollowUpType.CHAT) {
      const items = prepareOptions(DEFAULT_QUESTIONS_CHAT)
      setOptions(items)
    }
    if (selectedMode === FollowUpType.IMAGE) {
      const items = prepareOptions(DEFAULT_QUESTIONS_IMAGE)
      setOptions(items)
    }
    if (selectedMode === FollowUpType.DEEP_RESEARCH) {
      const items = prepareOptions(DEFAULT_QUESTIONS_DEEP_RESEARCH)
      setOptions(items)
    }
  }, [selectedMode, value, isMainPage])

  // скидываем курсор когда меняем подсказки
  useEffect(() => {
    setCursor(CURSOR_START_VALUE)
  }, [options])

  // запрос подсказок с debounce задержкой для оптимизации
  useEffect(() => {
    if (!isMainPage) return

    const debouncedFetch = debounce(async (value: string) => {
      const data = await fetchSuggestions(value || '')
      const items = prepareOptions(data)
      const slicedItems = [...items.slice(0, MAX_OPTIONS_LENGTH)]
      if (slicedItems.length > 0) {
        setIsOpenSuggestions(true)
        setOptions(slicedItems)
      } else {
        setIsOpenSuggestions(false)
        setOptions([])
      }
    }, 300)

    debouncedFetch(query)

    return () => {
      debouncedFetch.clear()
    }
  }, [query, isMainPage])

  const onChangeInput = useEvent((e: ChangeEvent<HTMLTextAreaElement>) => {
    onChange(e.target.value)
    setQuery(e.target.value)
  })

  return {
    options,
    cursor,
    setPreselected,
    onKeyDownInput,
    selectOption,
    isOpenSuggestions,
    closeSuggestions,
    onChangeInput,
    handleOpenSuggestions,
  }
}

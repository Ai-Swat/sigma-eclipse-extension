import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useLocation, useSearchParams } from 'react-router-dom'

import { useImprovementsStore } from 'src/store/improvements'
import { FollowUpType, TypeFollowUp } from 'src/store/types'
import { textImprovements } from 'src/routes/search/_components/improvements/improvement-definitions'
import { ImprovementsType } from 'src/routes/search/_components/improvements'
import {
  convertToTextGenerationSettings,
  setInitialTextGenerationSettings,
} from 'src/routes/search/_components/improvements/utils'
import { encodeWithSpecialCharacters } from 'src/libs/utils'
import { isEqualSettings } from '../improvements-utils'
import { useGoRelated } from './use-go-related'

const SESSION_KEY = 'selectedTextImprovements'
const IMPROVEMENTS_VERSION = 'v1' // Обнови эту версию при изменении структуры improvements

// Хук для управления состоянием "улучшений" (настройки генерации текста)
export function useImprovements(item: Partial<TypeFollowUp>) {
  const location = useLocation()
  const [searchParams] = useSearchParams()

  // Получение threadId из параметров URL
  const threadId = useMemo(
    () => encodeWithSpecialCharacters(searchParams.get('id') as string),
    [searchParams]
  )

  // Вызов функции goRelated
  const { callGoRelated } = useGoRelated(threadId)

  const { storeImprovements, setImprovements } = useImprovementsStore(
    useShallow((state) => ({
      storeImprovements: state.improvements,
      setImprovements: state.setImprovements,
    }))
  )

  // Функция загрузки улучшений из sessionStorage или дефолтного списка
  const loadSessionImprovements = useMemo(() => {
    try {
      const stored = sessionStorage?.getItem(SESSION_KEY)
      if (!stored) return textImprovements

      const parsed = JSON.parse(stored)
      // Проверяем актуальность версии и совпадение с текущим URL-поиском
      if (
        parsed.version !== IMPROVEMENTS_VERSION ||
        parsed.search !== location.search
      ) {
        return textImprovements
      }

      return parsed.data
    } catch {
      // Если sessionStorage повреждён или невалидный JSON
      return textImprovements
    }
  }, [location.search])

  // Локальное состояние выбранных улучшений
  const [selectedImprovements, setSelectedImprovements] = useState<
    ImprovementsType[]
  >(loadSessionImprovements)

  // Флаг первого рендера
  const [isFirstRender, setFirstRender] = useState(false)

  // Синхронизация локального состояния с глобальным Zustand store + sessionStorage
  useEffect(() => {
    // Сравниваем состояние стора и локальное состояние — если не совпадает, обновляем стор
    if (
      JSON.stringify(storeImprovements) !== JSON.stringify(selectedImprovements)
    ) {
      setImprovements(selectedImprovements)
    }

    // Сохраняем текущее состояние в sessionStorage
    sessionStorage?.setItem(
      SESSION_KEY,
      JSON.stringify({
        version: IMPROVEMENTS_VERSION,
        data: selectedImprovements,
        search: location.search,
      })
    )
  }, [selectedImprovements])

  // Обработчик изменения одной из улучшений
  const handleChangeImprovements = (updatedItem: ImprovementsType) => {
    setSelectedImprovements((prev) =>
      prev.map((el) => (el.title === updatedItem.title ? updatedItem : el))
    )
  }

  // Обработчик применения улучшений (запускает follow-up запрос)
  const handleApply = useCallback(() => {
    const followUpInitialSettings = item?.text_generation_settings
    const textGenerationSettings =
      convertToTextGenerationSettings(selectedImprovements)

    // Если настройки не изменились — ничего не делаем
    if (
      followUpInitialSettings &&
      isEqualSettings(textGenerationSettings, followUpInitialSettings)
    ) {
      return
    }

    // Инициируем follow-up вызов с новыми параметрами
    void callGoRelated({
      query: item.query || '',
      parent_id: item.id,
      followup_type: FollowUpType.TEXT_GENERATOR,
      text_generation_settings: textGenerationSettings,
      was_panel_used: true,
    })
  }, [item?.id, item?.query, threadId, selectedImprovements])

  // На первом рендере проверяем: если в item есть сохранённые настройки — применяем их
  useEffect(() => {
    if (isFirstRender) return

    setFirstRender(true)

    const followUpInitialSettings = item?.text_generation_settings
    if (followUpInitialSettings) {
      const initialSettings = setInitialTextGenerationSettings(
        followUpInitialSettings,
        loadSessionImprovements
      )

      // Если текущие настройки отличаются — обновляем
      if (
        JSON.stringify(selectedImprovements) !== JSON.stringify(initialSettings)
      ) {
        setSelectedImprovements(initialSettings)
      }
    }
  }, [item?.text_generation_settings, isFirstRender])

  // Возвращаем наружу нужные значения и обработчики
  return {
    handleChangeImprovements,
    handleApply,
    selectedImprovements,
    isEqualSettings,
  }
}

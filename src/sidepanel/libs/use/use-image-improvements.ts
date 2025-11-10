import { useCallback, useEffect, useMemo, useState } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSearchParams } from 'react-router-dom'

import { useImprovementsStore } from 'src/store/improvements'
import { FollowUpType, TypeFollowUp } from 'src/store/types'
import { imageImprovements } from 'src/routes/search/_components/improvements/improvement-definitions'
import { ImprovementsType } from 'src/routes/search/_components/improvements'
import {
  convertToImageGenerationSettings,
  setInitialTextGenerationSettings,
} from 'src/routes/search/_components/improvements/utils'
import { encodeWithSpecialCharacters } from 'src/libs/utils'
import { useGoRelated } from './use-go-related'

// Хук для управления улучшениями генерации изображений
export function useImageImprovements(item: Partial<TypeFollowUp>) {
  // Состояние выбранных улучшений изображения
  const [selectedImageImprovements, setSelectedImageImprovements] =
    useState(imageImprovements)

  // Флаг первого рендера (нужен для инициализации)
  const [isFirstRender, setFirstRender] = useState(false)

  // Доступ к Zustand-хранилищу улучшений для изображений
  const { storeImageImprovements, setImageImprovements } = useImprovementsStore(
    useShallow((state) => ({
      storeImageImprovements: state.imageImprovements,
      setImageImprovements: state.setImageImprovements,
    }))
  )

  // Синхронизируем локальное состояние с Zustand-хранилищем
  useEffect(() => {
    if (
      JSON.stringify(storeImageImprovements) !==
      JSON.stringify(selectedImageImprovements)
    ) {
      setImageImprovements(selectedImageImprovements)
    }
  }, [selectedImageImprovements])

  // Обработчик изменения одной из опций улучшения
  const handleChangeImageImprovements = (updatedItem: ImprovementsType) => {
    setSelectedImageImprovements((prev) =>
      prev.map((el) => (el.title === updatedItem.title ? updatedItem : el))
    )
  }

  // Получаем параметры из URL
  const [searchParams] = useSearchParams()
  const threadId = useMemo(
    () => encodeWithSpecialCharacters(searchParams.get('id') || ''),
    [searchParams]
  )

  // Вызов функции goRelated
  const { callGoRelated } = useGoRelated(threadId)

  // Проверка эквивалентности настроек генерации изображений
  const isEqualImageSettings = (
    initialSettings: any,
    selectedSettings: any
  ): boolean => {
    // Сортируем ключи, чтобы порядок не влиял на сравнение
    const orderedInitial = Object.fromEntries(
      Object.entries(initialSettings).sort()
    )
    const orderedSelected = Object.fromEntries(
      Object.entries(selectedSettings).sort()
    )
    return JSON.stringify(orderedInitial) === JSON.stringify(orderedSelected)
  }

  // Применение настроек и вызов follow-up генерации изображения
  const handleApplyImageGenerator = useCallback(() => {
    const followUpInitialSettings = item?.image_generation_settings
    const imageGenerationSettings = convertToImageGenerationSettings(
      selectedImageImprovements
    )

    // Если настройки не изменились — выход
    if (
      followUpInitialSettings &&
      isEqualImageSettings(imageGenerationSettings, followUpInitialSettings)
    ) {
      return
    }

    // Отправка follow-up запроса на генерацию изображения
    void callGoRelated({
      query: item.query || '',
      parent_id: item.id,
      followup_type: FollowUpType.IMAGE,
      image_generation_settings: imageGenerationSettings,
      was_panel_used: true,
    })
  }, [item?.id, item?.query, threadId, selectedImageImprovements])

  // Инициализация настроек при первом рендере (например, из сохранённых параметров follow-up)
  useEffect(() => {
    if (isFirstRender) return

    setFirstRender(true)

    const followUpInitialSettings = item?.image_generation_settings
    if (followUpInitialSettings) {
      // Преобразуем сохранённые настройки в структуру улучшений
      const initialSettings = setInitialTextGenerationSettings(
        followUpInitialSettings,
        imageImprovements
      )

      // Если текущие настройки отличаются — обновляем
      if (
        JSON.stringify(selectedImageImprovements) !==
        JSON.stringify(initialSettings)
      ) {
        setSelectedImageImprovements(initialSettings)
      }
    }
  }, [item?.image_generation_settings, isFirstRender])

  // Возвращаем API хука
  return {
    handleChangeImageImprovements, // Обновление отдельной опции
    handleApplyImageGenerator, // Применение улучшений (follow-up)
    selectedImageImprovements, // Текущий список улучшений
    isEqualImageSettings, // Утилита сравнения настроек
  }
}

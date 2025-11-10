import { useCallback, useEffect, useRef } from 'react'

export const useSaveInputState = (
  value: string,
  setValue?: (v: string) => void,
  storageKey: string = 'lastInputValue',
  isExtension: boolean = true
) => {
  const restoredRef = useRef(false)
  const lastSavedValueRef = useRef<string | null>(null)

  // Restore один раз при монтировании
  useEffect(() => {
    if (!isExtension) return

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        chrome.storage.local.get(storageKey).then((res) => {
          if (
            res &&
            storageKey in res &&
            typeof res[storageKey] === 'string' &&
            !value
          ) {
            setValue?.(res[storageKey])
            lastSavedValueRef.current = res[storageKey]
          }
          restoredRef.current = true
        })
      } catch (error) {
        console.error(
          `[useSaveInputState] Failed to restore "${storageKey}"`,
          error
        )
        restoredRef.current = true
      }
    } else {
      restoredRef.current = true
    }
    // только один раз при монтировании
  }, [])

  // Save — только если value изменился относительно последнего сохранённого
  useEffect(() => {
    if (!isExtension) return
    if (!restoredRef.current) return

    if (lastSavedValueRef.current === value) {
      return
    }

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        void chrome.storage.local.set({ [storageKey]: value })
        lastSavedValueRef.current = value
      } catch (error) {
        console.error(
          `[useSaveInputState] Failed to save "${storageKey}"`,
          error
        )
      }
    }
  }, [value, storageKey, isExtension])

  // Жёсткая очистка вручную
  const clearValue = useCallback(() => {
    if (setValue) setValue('')
    lastSavedValueRef.current = null
    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        void chrome.storage.local.remove(storageKey)
      } catch (error) {
        console.error(
          `[useSaveInputState] Failed to clear "${storageKey}"`,
          error
        )
      }
    }
  }, [storageKey, setValue])

  return { clearValue }
}

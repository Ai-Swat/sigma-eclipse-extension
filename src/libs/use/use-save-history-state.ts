import { useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

export const useSaveHistoryState = (isExtension: boolean = true) => {
  const location = useLocation()
  const navigate = useNavigate()
  const restoredRef = useRef(false) // флаг восстановления

  // При старте восстанавливаем страницу и сразу очищаем хранилище
  useEffect(() => {
    if (!isExtension) return

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        chrome.storage.local.get('lastVisitedPath').then((res) => {
          if (
            res.lastVisitedPath &&
            res.lastVisitedPath !== location.pathname
          ) {
            navigate(res.lastVisitedPath, { replace: true })
          }
          // очистка после восстановления
          chrome.storage.local.remove('lastVisitedPath')
          restoredRef.current = true // путь восстановлен
        })
      } catch (error) {
        console.error(
          'Failed to restore lastVisitedPath from chrome.storage:',
          error
        )
        restoredRef.current = true
      }
    } else {
      restoredRef.current = true
    }
  }, [isExtension])

  // Сохраняем последнюю страницу при каждом изменении роута
  useEffect(() => {
    if (!isExtension || !restoredRef.current) return // не сохраняем до восстановления

    if (typeof chrome !== 'undefined' && chrome.storage?.local) {
      try {
        if (location.pathname === '/search' && location.search === '?id=') {
          chrome.storage.local.remove('lastVisitedPath')
          return
        }
        chrome.storage.local.set({
          lastVisitedPath: location.pathname + location.search,
        })
      } catch (error) {
        console.error(
          'Failed to save lastVisitedPath in chrome.storage:',
          error
        )
      }
    }
  }, [location, isExtension])
}

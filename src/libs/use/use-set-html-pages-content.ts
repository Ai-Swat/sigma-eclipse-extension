import { useEffect } from 'react'
import { useShallow } from 'zustand/react/shallow'
import { useSearchStore } from 'src/store'
import { useSettingsStore } from 'src/store/settings'
import {
  guardIsPageHTMLData,
  PageHTMLData,
} from 'src/store/slices/html-context-slice'

export function useSetHTMLPagesContent() {
  const { setPageData, removePageData, syncPagesData } = useSearchStore(
    useShallow((state) => ({
      setPageData: state.setPageData,
      removePageData: state.removePageData,
      syncPagesData: state.syncPagesData,
    }))
  )
  const isExtension = useSettingsStore((state) => state.isExtension)

  useEffect(() => {
    if (!isExtension) return

    const handleMessage = (message: {
      type: string
      payload: PageHTMLData | { tab_id: number } | { tabsInfo: any[] }
      source: string
      to: string
    }) => {
      if (
        message?.source !== 'sigma-service-worker' ||
        message?.to !== 'sigma-extension'
      )
        return

      if (
        message?.type === 'SOME_PAGE_UPDATE_HTML' &&
        guardIsPageHTMLData(message.payload)
      ) {
        setPageData(message.payload)
      }

      if (
        message?.type === 'SOME_PAGE_REMOVE' &&
        'tab_id' in message.payload &&
        message.payload.tab_id
      ) {
        removePageData(message.payload.tab_id)
      }

      if (
        message?.type === 'UPDATE_ALL_PAGES' &&
        'tabsInfo' in message.payload &&
        message.payload.tabsInfo
      ) {
        syncPagesData(message.payload.tabsInfo)
      }
    }

    chrome.runtime.onMessage.addListener(handleMessage)

    // Очистка при размонтировании
    return () => {
      chrome.runtime.onMessage.removeListener(handleMessage)
    }
  }, [isExtension])
}

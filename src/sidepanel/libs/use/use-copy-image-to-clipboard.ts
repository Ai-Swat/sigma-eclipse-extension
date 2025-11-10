import { useCallback } from 'react'

type CopyFn = (
  url: string,
  callback?: (success: boolean) => void
) => Promise<boolean>

export const useCopyImageToClipboard = (): CopyFn => {
  const copyImgToClipboard: CopyFn = useCallback(async (url, callback) => {
    if (!navigator?.clipboard || !window.ClipboardItem) {
      console.warn('Clipboard API not supported')
      callback?.(false)
      return false
    }

    try {
      const response = await fetch(url, { mode: 'cors', cache: 'no-cache' })
      const blob = await response.blob()
      const blobData = new Blob([blob], { type: 'image/png' })

      const clipboardItem = new ClipboardItem({ ['image/png']: blobData })
      await navigator.clipboard.write([clipboardItem])

      callback?.(true)
      return true
    } catch (error) {
      console.warn('Copy to clipboard failed:', error)
      callback?.(false)
      return false
    }
  }, [])

  return copyImgToClipboard
}

export function copyToClipboard(str: string, cb: (status: boolean) => void) {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText === 'function'
  ) {
    navigator.clipboard
      .writeText(str)
      .then(() => cb(true))
      .catch(() => cb(false))
  } else {
    try {
      const textarea = document.createElement('textarea')
      textarea.value = str
      textarea.style.position = 'fixed' // предотвратить скролл
      textarea.style.opacity = '0' // не видно на странице
      document.body.appendChild(textarea)
      textarea.focus()
      textarea.select()

      const successful = document.execCommand('copy')
      document.body.removeChild(textarea)
      cb(successful)
    } catch {
      cb(false)
    }
  }
}

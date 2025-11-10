import { addToastError } from 'src/libs/toast-messages'
import { ACCEPTS } from './constants'

export const truncateFileName = (name: string, maxLength: number) => {
  if (name.length <= maxLength) return name

  const extIndex = name.lastIndexOf('.')
  const extension = extIndex !== -1 ? name.slice(extIndex) : ''
  return (
    name.slice(0, 4) + '...' + name.slice(-maxLength + 7 + extension.length)
  )
}

export const BYTES_IN_MB = 1048576
export const LIMIT_MB = 10

export const handleCheckFile = (file: File): boolean => {
  if (file.size > LIMIT_MB * BYTES_IN_MB) {
    addToastError('Error! File is too big!')
    return false
  }

  if (!ACCEPTS.includes(file.type)) {
    addToastError('Error! Incorrect file format')
    return false
  }

  return true
}

export const downloadFile = (blob: Blob, query?: string) => {
  // Получаем имя файла из заголовка
  let filename = `Sigma — ` + query

  // Создаем ссылку и инициируем загрузку
  const url = window.URL.createObjectURL(blob)

  const extension = getExtensionFromMime(blob.type)

  if (extension) {
    filename += `.${extension}`
  }

  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  window.URL.revokeObjectURL(url)
}

export const getExtensionFromMime = (mime: string) => {
  const map = {
    'application/pdf': '.pdf',
    'application/msword': '.docx',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      '.docx',
  }
  return map[mime as keyof typeof map] || ''
}

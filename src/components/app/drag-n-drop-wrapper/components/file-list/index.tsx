import { useMemo, memo } from 'react'
import { PhotoProvider } from 'react-photo-view'
import cn from 'clsx'
import { useThemeContext } from 'src/contexts/themeContext'
import { FileItem } from 'src/components/app/drag-n-drop-wrapper/components/file-item'
import { UploadedFile } from 'src/contexts/fileContext'
import styles from './styles.module.css'

interface Props {
  files?: (UploadedFile | undefined)[]
  onRemove?: (id: string) => void
  className?: string
  isUserMessage?: boolean
}

// отдельный мемоизированный компонент для элемента файла
const FileListItem = memo(({ file, onRemove, isUserMessage }: any) => (
  <FileItem file={file} onRemove={onRemove} isUserMessage={isUserMessage} />
))

export const FileList = ({
  files,
  onRemove,
  className,
  isUserMessage,
}: Props) => {
  const { theme } = useThemeContext()
  const isDark = theme === 'dark'

  // мемоизация классов
  const scrollWrapperClass = useMemo(
    () =>
      cn(styles.scrollWrapper, {
        [styles.isUserMessage]: isUserMessage,
      }),
    [isUserMessage]
  )

  const listClass = useMemo(
    () =>
      cn(styles.list, className, {
        [styles.isUserMessage]: isUserMessage,
        [styles.isInputLayout]: !isUserMessage,
      }),
    [className, isUserMessage]
  )

  // мемоизация списка файлов
  const renderedFiles = useMemo(() => {
    if (!files?.length) return null

    const validFiles = files.filter(Boolean) as UploadedFile[]

    if (!isUserMessage) {
      return validFiles.map((file, index) => (
        <FileListItem
          key={file.file_id || file.file_url || file.file_name || index}
          file={file}
          onRemove={onRemove}
          isUserMessage={false}
        />
      ))
    }

    const images: UploadedFile[] = []
    const docs: UploadedFile[] = []

    for (const file of validFiles) {
      const isImage =
        (file.type || file.file_extension)?.startsWith('image') ||
        /\.(jpeg|jpg|png|gif|webp)$/i.test(file.file_url?.toLowerCase() || '')
      if (isImage) images.push(file)
      else docs.push(file)
    }

    return (
      <>
        {images.length > 0 && (
          <div className={styles.imageWrap}>
            {images.map((file, index) => (
              <FileListItem
                key={
                  file.file_id ||
                  file.file_url ||
                  file.file_name ||
                  `img-${index}`
                }
                file={file}
                onRemove={onRemove}
                isUserMessage
              />
            ))}
          </div>
        )}
        {docs?.map((file, index) => (
          <FileListItem
            key={
              file.file_id || file.file_url || file.file_name || `doc-${index}`
            }
            file={file}
            onRemove={onRemove}
            isUserMessage
          />
        ))}
      </>
    )
  }, [files, onRemove, isUserMessage])

  return (
    <PhotoProvider
      photoWrapClassName='photo-wrap-style'
      maskOpacity={isDark ? 0.6 : 0.8}
      loop={false}
      maskClosable={true}
      className='banner-photo-provider'
    >
      <div className={scrollWrapperClass}>
        <div className={listClass}>{renderedFiles}</div>
      </div>
    </PhotoProvider>
  )
}

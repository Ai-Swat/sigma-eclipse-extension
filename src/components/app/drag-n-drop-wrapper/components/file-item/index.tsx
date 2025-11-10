import cn from 'clsx'
import { UploadedFile } from 'src/contexts/fileContext'
import { Loader } from 'src/components/ui/loader'
import PhotoViewItem from 'src/components/app/photo-view-item'
import IconClose from 'src/images/clear-icon.svg?react'
import IconFile from 'src/images/file.svg?react'
import styles from './styles.module.css'

const FileImage = ({
  fileUrl,
  isUserMessage,
}: {
  fileUrl?: string
  isUserMessage?: boolean
}) => {
  if (isUserMessage)
    return (
      <div className={styles.imageWrapperUserMessage}>
        <PhotoViewItem
          key={fileUrl}
          item={{
            resourceType: 'image',
            original: fileUrl,
            thumbnail: fileUrl,
          }}
          className={styles.imageUser}
        />
      </div>
    )

  return (
    <>
      {!fileUrl && (
        <div className={styles.loader}>
          <Loader size={24} />
        </div>
      )}

      {fileUrl && (
        <PhotoViewItem
          key={fileUrl}
          item={{
            resourceType: 'image',
            original: fileUrl,
            thumbnail: fileUrl,
          }}
          className={styles.image}
        />
      )}
    </>
  )
}

const FileIconType = ({ type }: { type: string }) => {
  return (
    <div
      className={cn(styles.fileIconWrapper, {
        [styles.red]: ['application/pdf', 'pdf'].includes(type),
        [styles.blue]: [
          'doc',
          'docx',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'txt',
          'text/plain',
          'tiff',
          'svg',
          'ico',
          'gif',
          'webp',
        ].includes(type),
        [styles.green]: [
          'xls',
          'xlsx',
          'csv',
          'text/csv',
          'html',
          'css',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ].includes(type),
        [styles.purple]: ['mp4', 'mp3', 'wav'].includes(type),
        [styles.orange]: ['js', 'ts', 'json'].includes(type),
      })}
    >
      <IconFile />
    </div>
  )
}

const FileDoc = ({
  file,
  fileUrl,
  isUserMessage,
}: {
  file: UploadedFile
  fileUrl?: string
  isUserMessage?: boolean
}) => {
  const name = file?.file_name || file?.name || 'unknown'
  const typeFileName = name?.split('.')?.at(-1)
  const type = file?.file_extension || typeFileName || 'unknown'

  if (fileUrl) {
    return (
      <a
        href={fileUrl}
        target='_blank'
        rel='noreferrer'
        className={cn(styles.fileDoc, {
          [styles.isUserMessage]: isUserMessage,
        })}
      >
        <FileIconType type={type} />
        <div className={styles.nameBlock}>
          <div className={styles.docName}>{name}</div>
          <div className={styles.docType}>
            {typeFileName?.toUpperCase()} File
          </div>
        </div>
      </a>
    )
  }

  return (
    <div
      className={cn(styles.fileDoc, {
        [styles.isUserMessage]: isUserMessage,
      })}
    >
      <div className={styles.fileLoader}>
        <Loader size={24} />
      </div>
      <div className={styles.nameBlock}>
        <div className={styles.docName}>{name}</div>
        <div className={styles.docType}>{typeFileName?.toUpperCase()} File</div>
      </div>
    </div>
  )
}

interface Props {
  file: UploadedFile
  onRemove?: (id: string) => void
  isUserMessage?: boolean
}
export const FileItem = ({ file, onRemove, isUserMessage }: Props) => {
  const { file_extension, file_url, type, file_id } = file || {}

  const isImage =
    (type || file_extension)?.startsWith('image') ||
    file_url?.toLowerCase()?.match(/\.(jpeg|jpg|png|gif|webp)$/)

  const hasRemoveHandler = typeof onRemove === 'function' && file_id

  return (
    <div className={styles.root}>
      {hasRemoveHandler && (
        <div
          className={cn(styles.remove, { [styles.isImage]: isImage })}
          onClick={() => onRemove?.(file_id)}
        >
          <IconClose width={12} height={12} className={styles.removeIcon} />
        </div>
      )}

      {isImage && (
        <FileImage isUserMessage={isUserMessage} fileUrl={file?.file_url} />
      )}
      {!isImage && (
        <FileDoc
          isUserMessage={isUserMessage}
          file={file}
          fileUrl={file?.file_url}
        />
      )}
    </div>
  )
}

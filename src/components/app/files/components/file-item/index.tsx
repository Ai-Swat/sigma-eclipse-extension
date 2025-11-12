import cn from 'clsx';
import { UploadedFile } from 'src/contexts/fileContext';
import { Loader } from 'src/components/ui/loader';
import IconClose from 'src/images/clear-icon.svg?react';
import IconFile from 'src/images/file.svg?react';
import { getTextPreview } from 'src/utils/file-text-extractor';
import styles from './styles.module.css';

export const FileIconType = ({ type }: { type: string }) => {
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
  );
};

const FileDoc = ({ file, isUserMessage }: { file: UploadedFile; isUserMessage?: boolean }) => {
  const name = file?.name || 'unknown';
  const typeFileName = name?.split('.')?.at(-1);
  const type = typeFileName || 'unknown';

  // Show text preview if available
  const textPreview = file.extractedText
    ? getTextPreview(file.extractedText, 50)
    : file.extractionError
      ? 'Error extracting text'
      : '';

  // Show loader if extracting
  const isExtracting = file.isExtracting;

  return (
    <div
      className={cn(styles.fileDoc, {
        [styles.isUserMessage]: isUserMessage,
      })}
    >
      {isExtracting ? (
        <div className={styles.fileLoader}>
          <Loader size={24} />
        </div>
      ) : (
        <FileIconType type={type} />
      )}
      <div className={styles.nameBlock}>
        <div className={styles.docName}>{name}</div>
        <div
          className={cn(styles.docType, {
            [styles.textPreview]: textPreview,
          })}
        >
          {type}
        </div>
      </div>
    </div>
  );
};

interface Props {
  file: UploadedFile;
  onRemove?: (idOrIndex: string | number) => void;
  isUserMessage?: boolean;
}

export const FileItem = ({ file, onRemove, isUserMessage }: Props) => {
  const { id } = file;
  const fileIdToUse = id;
  const hasRemoveHandler = typeof onRemove === 'function' && fileIdToUse;

  return (
    <div className={styles.root}>
      {hasRemoveHandler && (
        <div className={cn(styles.remove)} onClick={() => onRemove?.(fileIdToUse!)}>
          <IconClose width={12} height={12} className={styles.removeIcon} />
        </div>
      )}

      <FileDoc isUserMessage={isUserMessage} file={file} />
    </div>
  );
};

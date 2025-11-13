import cn from 'clsx';
import { FileItem } from '@/components/app/files/components/file-item';
import { UploadedFile } from '@/sidepanel/contexts/fileContext';
import styles from './styles.module.css';

interface Props {
  files?: (UploadedFile | undefined)[];
  onRemove?: (idOrIndex: string | number) => void;
  className?: string;
}

export const FileList = ({ files, onRemove, className }: Props) => {
  if (!files?.length) return null;

  const validFiles = files?.filter(Boolean) as UploadedFile[];

  return (
    <div className={styles.scrollWrapper}>
      <div className={cn(styles.list, className)}>
        {validFiles?.map((file, index) => (
          <FileItem key={file.id || file.name || `doc-${index}`} file={file} onRemove={onRemove} />
        ))}
      </div>
    </div>
  );
};

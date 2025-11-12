import { useMemo } from 'react';
import { PhotoProvider } from 'react-photo-view';
import cn from 'clsx';
import { useThemeContext } from '@/sidepanel/contexts/themeContext';
import { FileItem } from '@/components/app/files/components/file-item';
import { UploadedFile } from '@/sidepanel/contexts/fileContext';
import styles from './styles.module.css';

interface Props {
  files?: (UploadedFile | undefined)[];
  onRemove?: (idOrIndex: string | number) => void;
  className?: string;
  isUserMessage?: boolean;
}

export const FileList = ({ files, onRemove, className, isUserMessage }: Props) => {
  const { theme } = useThemeContext();
  const isDark = theme === 'dark';

  // мемоизация классов
  const scrollWrapperClass = useMemo(
    () =>
      cn(styles.scrollWrapper, {
        [styles.isUserMessage]: isUserMessage,
      }),
    [isUserMessage]
  );

  const listClass = useMemo(
    () =>
      cn(styles.list, className, {
        [styles.isUserMessage]: isUserMessage,
        [styles.isInputLayout]: !isUserMessage,
      }),
    [className, isUserMessage]
  );

  // мемоизация списка файлов
  const renderedFiles = useMemo(() => {
    if (!files?.length) return null;

    const validFiles = files.filter(Boolean) as UploadedFile[];

    if (!isUserMessage) {
      return validFiles.map((file, index) => (
        <FileItem
          key={file.id || file.name || index}
          file={file}
          onRemove={onRemove}
          isUserMessage={false}
        />
      ));
    }

    return (
      <>
        {validFiles?.map((file, index) => (
          <FileItem
            key={file.id || file.name || `doc-${index}`}
            file={file}
            onRemove={onRemove}
            isUserMessage
          />
        ))}
      </>
    );
  }, [files, onRemove, isUserMessage]);

  return (
    <PhotoProvider
      photoWrapClassName="photo-wrap-style"
      maskOpacity={isDark ? 0.6 : 0.8}
      loop={false}
      maskClosable={true}
      className="banner-photo-provider"
    >
      <div className={scrollWrapperClass}>
        <div className={listClass}>{renderedFiles}</div>
      </div>
    </PhotoProvider>
  );
};

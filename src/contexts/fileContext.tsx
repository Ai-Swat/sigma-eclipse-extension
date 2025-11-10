import React, { createContext, useContext, useState, useCallback, PropsWithChildren } from 'react';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  id: string;
}

interface FileContextType {
  files: File[];
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  processAndLimitFiles: (files: File[]) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  handleRemoveFile: (index: number) => void;
  clearFiles: () => void;
}

const FileContext = createContext<FileContextType | undefined>(undefined);

const MAX_FILES = 10;
const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB

export function FileContextProvider({ children }: PropsWithChildren) {
  const [files, setFiles] = useState<File[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);

  const processAndLimitFiles = useCallback((newFiles: File[]) => {
    const validFiles = newFiles.filter((file) => {
      if (file.size > MAX_FILE_SIZE) {
        console.warn(`File ${file.name} exceeds size limit`);
        return false;
      }
      return true;
    });

    setFiles((prevFiles) => {
      const combined = [...prevFiles, ...validFiles];
      return combined.slice(0, MAX_FILES);
    });
  }, []);

  const handlePaste = useCallback(
    (e: React.ClipboardEvent) => {
      const items = e.clipboardData?.items;
      if (!items) return;

      const files: File[] = [];
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const file = item.getAsFile();
          if (file) files.push(file);
        }
      }

      if (files.length > 0) {
        processAndLimitFiles(files);
      }
    },
    [processAndLimitFiles]
  );

  const handleRemoveFile = useCallback((index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setUploadedFiles([]);
  }, []);

  return (
    <FileContext.Provider
      value={{
        files,
        uploadedFiles,
        isDragging,
        setIsDragging,
        processAndLimitFiles,
        handlePaste,
        handleRemoveFile,
        clearFiles,
      }}
    >
      {children}
    </FileContext.Provider>
  );
}

export function useFileContext() {
  const context = useContext(FileContext);
  if (!context) {
    throw new Error('useFileContext must be used within FileContextProvider');
  }
  return context;
}


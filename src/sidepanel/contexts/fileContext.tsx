import React, { createContext, useContext, useState, useCallback, PropsWithChildren } from 'react';
import { extractTextFromFile } from 'src/utils/file-text-extractor';

export interface UploadedFile {
  name: string;
  size: number;
  type: string;
  url?: string;
  id: string;
  extractedText?: string;
  isExtracting?: boolean;
  extractionError?: string;
}

interface FileContextType {
  files: File[];
  uploadedFiles: UploadedFile[];
  isDragging: boolean;
  setIsDragging: (isDragging: boolean) => void;
  processAndLimitFiles: (files: File[]) => void;
  handlePaste: (e: React.ClipboardEvent) => void;
  handleRemoveFile: (idOrIndex: string | number) => void;
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

    // Limit to 1 file - clear existing files before adding new one
    if (validFiles.length === 0) return;
    
    // Take only the first file
    const file = validFiles[0];
    const fileId = `${file.name}-${Date.now()}-${Math.random()}`;

    // Replace existing files with new one (limit to 1 file)
    setUploadedFiles([
      {
        id: fileId,
        name: file.name,
        size: file.size,
        type: file.type,
        isExtracting: true,
      },
    ]);

    // Extract text from the file
    (async () => {
      const result = await extractTextFromFile(file);
      
      // Update with extracted text
      setUploadedFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                isExtracting: false,
                extractedText: result.text,
                extractionError: result.error,
              }
            : f
        )
      );
    })();
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

  const handleRemoveFile = useCallback((idOrIndex: string | number) => {
    if (typeof idOrIndex === 'string') {
      // Remove by id (new files with extracted text)
      setUploadedFiles((prevFiles) => prevFiles.filter((f) => f.id !== idOrIndex));
    } else {
      // Remove by index (legacy behavior)
      setFiles((prevFiles) => prevFiles.filter((_, i) => i !== idOrIndex));
      setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== idOrIndex));
    }
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



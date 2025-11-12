import { createContext, useContext, PropsWithChildren } from 'react';

interface DictateContextType {
  isRecording: boolean;
  transcribedText: string;
  clearTranscribedText: () => void;
}

const DictateContext = createContext<DictateContextType | undefined>(undefined);

export function DictateContextProvider({ children }: PropsWithChildren) {
  // Stub implementation - voice dictation not needed for extension
  const value: DictateContextType = {
    isRecording: false,
    transcribedText: '',
    clearTranscribedText: () => {},
  };

  return <DictateContext.Provider value={value}>{children}</DictateContext.Provider>;
}

export function useDictateContext() {
  const context = useContext(DictateContext);
  if (!context) {
    throw new Error('useDictateContext must be used within DictateContextProvider');
  }
  return context;
}

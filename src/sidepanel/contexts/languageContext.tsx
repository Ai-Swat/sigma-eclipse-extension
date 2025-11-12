import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  SupportedLanguage,
  getSummarizationPrompt,
  getBrowserLanguage,
} from '../locales/prompts.ts';

const STORAGE_KEY = 'app_language';

interface LanguageContextType {
  language: SupportedLanguage;
  setLanguage: (lang: SupportedLanguage) => void;
  getSummarizationPrompt: () => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<SupportedLanguage>('en');
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize language from storage or browser
  useEffect(() => {
    const initLanguage = async () => {
      try {
        const result = await chrome.storage.local.get(STORAGE_KEY);

        if (result[STORAGE_KEY]) {
          setLanguageState(result[STORAGE_KEY] as SupportedLanguage);
        } else {
          // First time - use browser language
          const browserLang = getBrowserLanguage();
          setLanguageState(browserLang);
          await chrome.storage.local.set({ [STORAGE_KEY]: browserLang });
        }
      } catch (error) {
        console.error('Failed to load language from storage:', error);
        setLanguageState(getBrowserLanguage());
      } finally {
        setIsInitialized(true);
      }
    };

    initLanguage();
  }, []);

  const setLanguage = async (lang: SupportedLanguage) => {
    try {
      await chrome.storage.local.set({ [STORAGE_KEY]: lang });
      setLanguageState(lang);
    } catch (error) {
      console.error('Failed to save language to storage:', error);
    }
  };

  const getPrompt = () => getSummarizationPrompt(language);

  if (!isInitialized) {
    return null; // or a loading spinner
  }

  return (
    <LanguageContext.Provider value={{ language, setLanguage, getSummarizationPrompt: getPrompt }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

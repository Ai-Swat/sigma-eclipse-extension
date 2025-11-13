import { createContext, useContext, useState, useEffect, PropsWithChildren } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeContextProvider({ children }: PropsWithChildren) {
  const [theme, setTheme] = useState<Theme>('light');

  // Load theme from system preference
  useEffect(() => {
    const darkThemeMq = window.matchMedia('(prefers-color-scheme: dark)');
    const initialTheme = darkThemeMq.matches ? 'dark' : 'light';
    setTheme(initialTheme);

    const mqListener = (e: MediaQueryListEventMap['change']) => {
      setTheme(e.matches ? 'dark' : 'light');
    };

    darkThemeMq.addEventListener('change', mqListener);
    return () => darkThemeMq.removeEventListener('change', mqListener);
  }, []);

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    const html = document.documentElement;
    html.className = `theme-${theme}`;
    // Save to storage
    chrome.storage.local.set({ theme });
  }, [theme]);

  return <ThemeContext.Provider value={{ theme }}>{children}</ThemeContext.Provider>;
}

export function useThemeContext() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within ThemeContextProvider');
  }
  return context;
}

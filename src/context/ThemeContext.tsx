import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppTheme, AppLanguage } from '../types';

interface ThemeContextType {
  theme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  language: AppLanguage;
  setLanguage: (lang: AppLanguage) => void;
  isSettingsOpen: boolean;
  setIsSettingsOpen: (open: boolean) => void;
  toggleSettings: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default theme is 'light' (Biru Putih Dominan Putih)
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pkbi_app_theme') as AppTheme;
      if (saved === 'dark' || saved === 'light') return saved;
    }
    return 'light';
  });

  const [language, setLanguageState] = useState<AppLanguage>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pkbi_app_language') as AppLanguage;
      if (saved === 'id' || saved === 'en' || saved === 'ban') return saved;
    }
    return 'id';
  });

  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const setTheme = (newTheme: AppTheme) => {
    setThemeState(newTheme);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pkbi_app_theme', newTheme);
    }
  };

  const setLanguage = (newLang: AppLanguage) => {
    setLanguageState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('pkbi_app_language', newLang);
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen((prev) => !prev);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme,
        setTheme,
        language,
        setLanguage,
        isSettingsOpen,
        setIsSettingsOpen,
        toggleSettings,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useAppTheme must be used within a ThemeProvider');
  }
  return context;
};

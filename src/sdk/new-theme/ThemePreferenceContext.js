import { GlobalTheme } from '@carbon/react';
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { ThemeModal } from './ThemeModal';

const ThemePreferenceContext = createContext();

function useThemePreference() {
  return useContext(ThemePreferenceContext);
}

function ThemePreferenceProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme-preference') ?? 'g10');

  const [isThemeChangeModalOpen, openThemeChangeModal] = useState(false);

  const changeThemeManually = useCallback((theme) => {
    document.documentElement.setAttribute('data-carbon-theme', theme);
  }, [])

  useEffect(() => {
    document.documentElement.setAttribute('data-carbon-theme', theme);
    localStorage.setItem('theme-preference', theme)
  }, [theme]);

  const value = {
    theme,
    setTheme,
    changeThemeManually,
    isThemeChangeModalOpen, 
    openThemeChangeModal
  };
  return (
    <ThemePreferenceContext.Provider value={value}>
      <GlobalTheme theme={theme}>{children}</GlobalTheme>
      <ThemeModal/>
    </ThemePreferenceContext.Provider>
  );
}

export { ThemePreferenceProvider, useThemePreference };
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Theme, themes } from '@/config/themes';

interface ThemeContextType {
  currentTheme: Theme;
  setTheme: (themeName: string) => void;
}

const defaultTheme = themes.default;

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: defaultTheme,
  setTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentTheme] = useState<Theme>(() => {
    try {
      const savedTheme = localStorage.getItem('fluxTheme');
      return savedTheme && themes[savedTheme] ? themes[savedTheme] : defaultTheme;
    } catch (error) {
      console.error('Error loading theme:', error);
      return defaultTheme;
    }
  });

  useEffect(() => {
    try {
      // Apply theme to document
      document.documentElement.style.setProperty('--primary-color', currentTheme.colors.primary);
      document.documentElement.style.setProperty('--secondary-color', currentTheme.colors.secondary);
      document.documentElement.style.setProperty('--background-color', currentTheme.colors.background);
      document.documentElement.style.setProperty('--text-color', currentTheme.colors.text);
      document.documentElement.style.setProperty('--border-color', currentTheme.colors.border);
      document.documentElement.style.setProperty('--hover-color', currentTheme.colors.hover);
      document.documentElement.style.setProperty('--accent-color', currentTheme.colors.accent);
      
      // Apply fonts
      document.documentElement.style.setProperty('--heading-font', currentTheme.fonts.heading);
      document.documentElement.style.setProperty('--body-font', currentTheme.fonts.body);
    } catch (error) {
      console.error('Error applying theme:', error);
    }
  }, [currentTheme]);

  const setTheme = (themeName: string) => {
    try {
      if (themes[themeName]) {
        setCurrentTheme(themes[themeName]);
        localStorage.setItem('fluxTheme', themeName);
      }
    } catch (error) {
      console.error('Error setting theme:', error);
    }
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}; 
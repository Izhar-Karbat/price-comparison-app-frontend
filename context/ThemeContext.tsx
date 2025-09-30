// context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { feminineTheme } from '../themes/feminine';
import { masculineTheme } from '../themes/masculine';
import { claymorphismTheme } from '../themes/claymorphism';
import type { Theme } from '../themes/feminine';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (themeMode: 'feminine' | 'masculine' | 'claymorphism') => void;
  isLoading: boolean;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = 'pharmmate_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  // Default to claymorphism theme
  const [theme, setThemeState] = useState<Theme>(claymorphismTheme as Theme);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
      if (savedTheme) {
        const themeMode = savedTheme as 'feminine' | 'masculine' | 'claymorphism';
        if (themeMode === 'masculine') {
          setThemeState(masculineTheme);
        } else if (themeMode === 'feminine') {
          setThemeState(feminineTheme);
        } else {
          setThemeState(claymorphismTheme as Theme);
        }
      } else {
        // Default to claymorphism if no saved theme
        setThemeState(claymorphismTheme as Theme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveTheme = async (themeMode: 'feminine' | 'masculine' | 'claymorphism') => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, themeMode);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  };

  const toggleTheme = () => {
    // Cycle through themes: claymorphism -> feminine -> masculine -> claymorphism
    let newTheme: Theme;
    if (theme.mode === 'claymorphism') {
      newTheme = feminineTheme;
    } else if (theme.mode === 'feminine') {
      newTheme = masculineTheme;
    } else {
      newTheme = claymorphismTheme as Theme;
    }
    setThemeState(newTheme);
    saveTheme(newTheme.mode as 'feminine' | 'masculine' | 'claymorphism');
  };

  const setTheme = (themeMode: 'feminine' | 'masculine' | 'claymorphism') => {
    let newTheme: Theme;
    if (themeMode === 'masculine') {
      newTheme = masculineTheme;
    } else if (themeMode === 'feminine') {
      newTheme = feminineTheme;
    } else {
      newTheme = claymorphismTheme as Theme;
    }
    setThemeState(newTheme);
    saveTheme(themeMode);
  };

  const contextValue: ThemeContextType = {
    theme,
    toggleTheme,
    setTheme,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
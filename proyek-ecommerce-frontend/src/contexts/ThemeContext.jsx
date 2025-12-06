import { createContext, useContext } from 'react';

// 1. Buat Context
export const ThemeContext = createContext();

// 2. Buat Custom Hook
export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme harus digunakan di dalam ThemeProvider');
  }
  return context;
};
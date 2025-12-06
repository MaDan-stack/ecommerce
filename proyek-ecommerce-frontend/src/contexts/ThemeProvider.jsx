import React, { useState, useEffect, useMemo } from 'react';
import PropTypes from 'prop-types';
import { ThemeContext } from './ThemeContext';

export const ThemeProvider = ({ children }) => {
  // Cek preferensi awal
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    // Jika ada di storage pakai itu, jika tidak cek preferensi sistem
    if (storedTheme) return storedTheme;
    return globalThis.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  });

  useEffect(() => {
    const root = globalThis.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'light' ? 'dark' : 'light'));
  };

  const value = useMemo(() => ({ theme, toggleTheme }), [theme]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

ThemeProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
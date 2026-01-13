// src/components/ThemeProvider.jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(() => {
    // Check localStorage first
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) return savedTheme;

    // Default to dark theme
    return 'dark';
  });

  useEffect(() => {
    const root = document.documentElement;

    // Remove all theme classes
    root.classList.remove('dark', 'premium');

    // Apply new theme class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else if (theme === 'premium') {
      root.classList.add('premium');
    }
    // Light theme has no class (default)

    // Save to localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const themes = [
    { name: 'Light', value: 'light', icon: '☀️' },
    { name: 'Dark', value: 'dark', icon: '🌙' },
    { name: 'Premium', value: 'premium', icon: '✨' },
  ];

  return (
    <ThemeContext.Provider value={{ theme, setTheme, themes }}>
      {children}
    </ThemeContext.Provider>
  );
};
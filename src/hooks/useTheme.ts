import { useState, useEffect } from 'react';

export type Theme = 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'pink';

export const themes: { value: Theme; label: string; color: string }[] = [
  { value: 'blue', label: '蓝色主题', color: '#3b82f6' },
  { value: 'green', label: '绿色主题', color: '#22c55e' },
  { value: 'purple', label: '紫色主题', color: '#a855f7' },
  { value: 'orange', label: '橙色主题', color: '#f97316' },
  { value: 'cyan', label: '青色主题', color: '#06b6d4' },
  { value: 'pink', label: '粉色主题', color: '#ec4899' },
];

const STORAGE_KEY = 'app-theme';

export const useTheme = () => {
  const [theme, setThemeState] = useState<Theme>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return (saved as Theme) || 'blue';
  });

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'blue') {
      root.removeAttribute('data-theme');
    } else {
      root.setAttribute('data-theme', theme);
    }
    localStorage.setItem(STORAGE_KEY, theme);
  }, [theme]);

  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
  };

  const toggleTheme = () => {
    const currentIndex = themes.findIndex(t => t.value === theme);
    const nextIndex = (currentIndex + 1) % themes.length;
    setThemeState(themes[nextIndex].value);
  };

  return { theme, setTheme, toggleTheme, themes };
};

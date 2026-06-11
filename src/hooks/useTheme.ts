import { useState, useEffect } from 'react';

export type Theme = 'blue' | 'green' | 'purple' | 'orange' | 'cyan' | 'pink';

interface ThemeColors {
  50: string;
  100: string;
  200: string;
  300: string;
  400: string;
  500: string;
  600: string;
  700: string;
  800: string;
  900: string;
}

const themeColors: Record<Theme, ThemeColors> = {
  blue: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  green: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  purple: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  orange: {
    50: '#fff7ed',
    100: '#ffedd5',
    200: '#fed7aa',
    300: '#fdba74',
    400: '#fb923c',
    500: '#f97316',
    600: '#ea580c',
    700: '#c2410c',
    800: '#9a3412',
    900: '#7c2d12',
  },
  cyan: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
  },
  pink: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
  },
};

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
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return (saved as Theme) || 'blue';
    } catch {
      return 'blue';
    }
  });

  useEffect(() => {
    const root = document.documentElement;
    const colors = themeColors[theme];
    
    // 直接设置 CSS 变量
    Object.entries(colors).forEach(([key, value]) => {
      root.style.setProperty(`--primary-${key}`, value);
    });
    
    // 保存到 localStorage
    try {
      localStorage.setItem(STORAGE_KEY, theme);
    } catch {
      // 忽略存储错误
    }
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

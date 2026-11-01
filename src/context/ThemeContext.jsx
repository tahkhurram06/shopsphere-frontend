'use client';
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('theme');
    const initial =
      stored || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    setTheme(initial);
    document.documentElement.classList.toggle('dark', initial === 'dark');
    setMounted(true);
  }, []);

  const toggleTheme = (originEvent) => {
    const next = theme === 'dark' ? 'light' : 'dark';

    const apply = () => {
      localStorage.setItem('theme', next);
      document.documentElement.classList.toggle('dark', next === 'dark');
      setTheme(next);
    };

    const supportsViewTransitions =
      typeof document !== 'undefined' && !!document.startViewTransition;
    const reducedMotion =
      typeof window !== 'undefined' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (!supportsViewTransitions || reducedMotion) {
      apply();
      return;
    }

    const x = originEvent?.clientX ?? window.innerWidth / 2;
    const y = originEvent?.clientY ?? window.innerHeight / 2;
    document.documentElement.style.setProperty('--theme-toggle-x', `${x}px`);
    document.documentElement.style.setProperty('--theme-toggle-y', `${y}px`);

    const maxRadius = Math.hypot(
      Math.max(x, window.innerWidth - x),
      Math.max(y, window.innerHeight - y)
    );
    document.documentElement.style.setProperty('--theme-toggle-radius', `${maxRadius}px`);

    document.startViewTransition(apply);
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, mounted }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}
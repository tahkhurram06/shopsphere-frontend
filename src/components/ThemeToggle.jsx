'use client';
import { useTheme } from '@/context/ThemeContext';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme, mounted } = useTheme();

  if (!mounted) {
    return <div className={`w-8 h-8 rounded-lg ${className}`} />;
  }

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={(e) => toggleTheme(e)}
      aria-label="Toggle dark mode"
      className={`theme-toggle-btn relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 bg-white overflow-hidden shadow-sm shadow-gray-900/5 border border-gray-200 hover:shadow-md hover:shadow-gray-900/10 hover:text-gray-900 hover:-translate-y-0.5 active:scale-90 active:translate-y-0 transition-all duration-150 ${className}`}
    >
      <span key={theme} className="animate-theme-icon-in" style={{ display: 'inline-flex' }}>
        {isDark ? (
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M12 3v1.5M12 19.5V21M4.22 4.22l1.06 1.06M18.72 18.72l1.06 1.06M3 12h1.5M19.5 12H21M4.22 19.78l1.06-1.06M18.72 5.28l1.06-1.06M16.5 12a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z"
            />
          </svg>
        ) : (
          <svg className="w-[18px] h-[18px]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.8}
              d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z"
            />
          </svg>
        )}
      </span>
    </button>
  );
}
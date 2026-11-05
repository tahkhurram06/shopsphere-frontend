'use client';
import { useState, useRef, useEffect } from 'react';

/**
 * Generic styled dropdown for filters, ported from the admin dashboard.
 * options: [{ value, label, dot? }] — dot is an optional tailwind bg-* class for a status-style indicator.
 */
export default function FilterDropdown({ value, options, onChange, placeholder = 'Select' }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const current = options.find((o) => o.value === value);

  return (
    <div ref={ref} className="relative inline-block text-left w-full sm:w-auto">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 border border-gray-200 rounded-xl pl-3.5 pr-2.5 py-2.5 text-sm capitalize outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 cursor-pointer bg-white min-w-[150px] w-full sm:w-auto justify-between active:scale-[0.98]"
      >
        <span className="flex items-center gap-2 truncate">
          {current?.dot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${current.dot}`} />}
          {current?.label || placeholder}
        </span>
        <svg
          className={`w-3.5 h-3.5 text-gray-400 transition-transform duration-150 shrink-0 ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 z-30 mt-1.5 w-full min-w-[150px] bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-900/10 overflow-hidden animate-fade-in max-h-64 overflow-y-auto">
          {options.map((o) => (
            <button
              key={o.value}
              type="button"
              onClick={() => {
                onChange(o.value);
                setOpen(false);
              }}
              className={`w-full flex items-center gap-2 px-3.5 py-2 text-sm capitalize text-left transition-colors duration-100 cursor-pointer ${
                o.value === value ? 'bg-gray-900 text-white' : 'text-gray-700 hover:bg-gray-50'
              }`}
            >
              {o.dot && (
                <span
                  className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                    o.value === value ? 'bg-white' : o.dot
                  }`}
                />
              )}
              {o.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
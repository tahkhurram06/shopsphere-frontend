'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';

const KEY = 'cookieConsent'; // 'accepted' | 'declined'

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(KEY);
      if (!stored) setVisible(true);
    } catch {
      // if localStorage is unavailable, don't block rendering on it
    }
  }, []);

  const respond = (value) => {
    try {
      localStorage.setItem(KEY, value);
    } catch {}
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-label="Cookie consent"
      className="fixed bottom-[60px] sm:bottom-0 inset-x-0 z-40 animate-fade-in-up"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-4 sm:pb-5">
        <div className="bg-white border border-gray-200 rounded-2xl shadow-lg shadow-gray-900/10 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-5">
          <p className="text-sm text-gray-600 leading-relaxed flex-1">
            We use cookies to keep you signed in, remember your preferences, and improve your
            experience. See our{' '}
            <Link href="/privacy" className="text-gray-900 font-medium underline">
              Privacy Policy
            </Link>{' '}
            to learn more.
          </p>
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={() => respond('declined')}
              className="text-sm font-medium text-gray-600 border border-gray-200 rounded-xl px-4 py-2 transition-all duration-150 hover:border-gray-300 active:scale-[0.98]"
            >
              Decline
            </button>
            <button
              type="button"
              onClick={() => respond('accepted')}
              className="text-sm font-medium text-white bg-gray-900 rounded-xl px-4 py-2 transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
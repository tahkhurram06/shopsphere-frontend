'use client';
import { useEffect } from 'react';
import Link from 'next/link';

// Next.js requires error.jsx to be a Client Component. Kept intentionally
// simple/self-contained (no Header, no context hooks) since this renders
// when something upstream has already gone wrong.
export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-white">
      <div className="text-center max-w-sm animate-fade-in-up">
        <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto mb-5">
          <svg className="w-7 h-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
          </svg>
        </div>
        <h1 className="text-xl font-medium text-gray-900 mb-2">
          Something went wrong
        </h1>
        <p className="text-sm text-gray-400 mb-7 leading-relaxed">
          An unexpected error occurred. You can try again, or head back to the shop.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            type="button"
            onClick={() => reset()}
            className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
          >
            Try again
          </button>
          <Link
            href="/"
            className="border border-gray-200 text-gray-900 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:border-gray-300 active:scale-[0.98]"
          >
            Back to shop
          </Link>
        </div>
      </div>
    </main>
  );
}
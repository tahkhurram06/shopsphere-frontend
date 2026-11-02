'use client';
import { useState } from 'react';
import { useToast } from '@/context/ToastContext';

// Frontend only for now: shows a confirmation but does not store the email.
export default function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    toast({ message: 'Thanks for subscribing.', type: 'success' });
    setEmail('');
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="you@example.com"
        aria-label="Email address"
        className="min-w-0 flex-1 border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
      />
      <button
        type="submit"
        className="shrink-0 bg-gray-900 text-white rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
      >
        Subscribe
      </button>
    </form>
  );
}
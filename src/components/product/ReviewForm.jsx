'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function ReviewForm({ productId }) {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!user) {
    return (
      <div className="border border-gray-200 rounded-2xl p-5 text-sm text-gray-500">
        <button
          onClick={() => router.push('/login')}
          className="text-gray-900 font-medium underline"
        >
          Log in
        </button>{' '}
        to leave a review.
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (rating === 0) {
      setError('Please select a star rating.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/products/${productId}/reviews`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ rating, comment }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to submit review');

      toast({ message: 'Review posted.', type: 'success' });
      setRating(0);
      setComment('');
      router.refresh();
    } catch (err) {
      setError(err.message);
      toast({ message: err.message, type: 'error' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border border-gray-200 rounded-2xl p-5 flex flex-col gap-3"
    >
      <h3 className="text-sm font-medium text-gray-900">Leave a review</h3>

      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-100 rounded-xl px-3.5 py-2.5">
          {error}
        </div>
      )}

      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoverRating(star)}
            onMouseLeave={() => setHoverRating(0)}
            className="text-2xl leading-none transition-transform duration-100 hover:scale-110 active:scale-95"
            aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
          >
            <span className={(hoverRating || rating) >= star ? 'text-amber-500' : 'text-gray-200'}>
              ★
            </span>
          </button>
        ))}
      </div>

      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="What did you think?"
        rows={3}
        required
        className="border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5 resize-none"
      />

      <button
        type="submit"
        disabled={submitting}
        className="self-start bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {submitting && (
          <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        )}
        {submitting ? 'Posting...' : 'Post review'}
      </button>
    </form>
  );
}
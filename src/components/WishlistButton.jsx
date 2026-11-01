'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';

export default function WishlistButton({ productId, className = '' }) {
  const { user, token } = useAuth();
  const { toast } = useToast();
  const router = useRouter();
  const [inWishlist, setInWishlist] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wishlist`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setInWishlist(data.some((p) => p._id === productId));
        }
      })
      .catch(() => {});
  }, [token, productId]);

  const handleToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wishlist/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update wishlist');
      setInWishlist(data.added);
      toast({ message: data.added ? 'Added to wishlist.' : 'Removed from wishlist.', type: 'success' });
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`w-11 h-11 flex items-center justify-center rounded-xl border transition-all duration-150 active:scale-90 disabled:opacity-50 ${
        inWishlist
          ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
          : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
      } ${className}`}
    >
      <svg
        className="w-[18px] h-[18px]"
        fill={inWishlist ? 'currentColor' : 'none'}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
        />
      </svg>
    </button>
  );
}
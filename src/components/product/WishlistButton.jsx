'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useWishlist } from '@/context/WishlistContext';

// variant: 'default' (product page) | 'card' (small round heart over product cards)
export default function WishlistButton({ productId, className = '', variant = 'default' }) {
  const { user } = useAuth();
  const { toast } = useToast();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const inWishlist = isInWishlist(productId);

  const handleToggle = async () => {
    if (!user) {
      router.push('/login');
      return;
    }
    setLoading(true);
    try {
      const added = await toggleWishlist(productId);
      toast({ message: added ? 'Added to wishlist.' : 'Removed from wishlist.', type: 'success' });
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const styles =
    variant === 'card'
      ? `w-9 h-9 rounded-full bg-white/90 backdrop-blur shadow-sm border ${
          inWishlist
            ? 'border-red-200 text-red-500'
            : 'border-gray-200 text-gray-500 hover:text-red-500'
        }`
      : `w-11 h-11 rounded-xl border ${
          inWishlist
            ? 'bg-red-50 border-red-200 text-red-500 hover:bg-red-100'
            : 'bg-white border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200'
        }`;

  return (
    <button
      type="button"
      onClick={handleToggle}
      disabled={loading}
      aria-label={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      title={inWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`flex items-center justify-center transition-all duration-150 active:scale-90 disabled:opacity-50 ${styles} ${className}`}
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
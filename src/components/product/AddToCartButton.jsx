'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { useCart } from '@/context/CartContext';

export default function AddToCartButton({ productId, stock = 0, quantity = 1 }) {
  const { token, user } = useAuth();
  const { toast } = useToast();
  const { refreshCart } = useCart();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const outOfStock = stock <= 0;

  const handleAddToCart = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ productId, quantity }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add to cart');
      toast({ message: `Added ${quantity} to cart.`, type: 'success' });
      refreshCart();
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleAddToCart}
      disabled={loading || outOfStock}
      className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center gap-2"
    >
      {loading && (
        <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      )}
      {outOfStock ? 'Out of stock' : loading ? 'Adding...' : 'Add to cart'}
    </button>
  );
}
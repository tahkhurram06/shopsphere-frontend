'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

// Holds the set of wishlisted product IDs in one place, so any number of
// heart buttons can read from it without each making its own request.
export function WishlistProvider({ children }) {
  const { token, user } = useAuth();
  const [ids, setIds] = useState(() => new Set());

  const refreshWishlist = useCallback(async () => {
    if (!token) {
      setIds(new Set());
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setIds(new Set(Array.isArray(data) ? data.map((p) => p._id) : []));
    } catch {
      // silent — hearts just won't update this cycle
    }
  }, [token]);

  useEffect(() => {
    if (user) refreshWishlist();
    else setIds(new Set());
  }, [user, refreshWishlist]);

  const isInWishlist = useCallback((productId) => ids.has(productId), [ids]);

  // Resolves to true if the product was added, false if removed. Throws on failure.
  const toggleWishlist = useCallback(
    async (productId) => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wishlist/${productId}`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update wishlist');
      setIds((prev) => {
        const next = new Set(prev);
        if (data.added) next.add(productId);
        else next.delete(productId);
        return next;
      });
      return data.added;
    },
    [token]
  );

  return (
    <WishlistContext.Provider
      value={{ count: ids.size, refreshWishlist, isInWishlist, toggleWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
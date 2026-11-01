'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export function WishlistProvider({ children }) {
  const { token, user } = useAuth();
  const [count, setCount] = useState(0);

  const refreshWishlist = useCallback(async () => {
    if (!token) {
      setCount(0);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      setCount(Array.isArray(data) ? data.length : 0);
    } catch {
      // silent — badge just won't update this cycle
    }
  }, [token]);

  useEffect(() => {
    if (user) refreshWishlist();
    else setCount(0);
  }, [user, refreshWishlist]);

  return (
    <WishlistContext.Provider value={{ count, refreshWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  return useContext(WishlistContext);
}
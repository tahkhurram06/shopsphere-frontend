'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const { token, user } = useAuth();
  const [count, setCount] = useState(0);

  const refreshCart = useCallback(async () => {
    if (!token) {
      setCount(0);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) return;
      const data = await res.json();
      const total = (data.items || []).reduce((sum, item) => sum + item.quantity, 0);
      setCount(total);
    } catch {
      // silent — badge just won't update this cycle
    }
  }, [token]);

  useEffect(() => {
    if (user) refreshCart();
    else setCount(0);
  }, [user, refreshCart]);

  return (
    <CartContext.Provider value={{ count, refreshCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
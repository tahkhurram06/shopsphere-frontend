'use client';
import { useEffect, useRef, useState } from 'react';
import AddToCartButton from '@/components/product/AddToCartButton';

// Quantity stepper + Add to cart, plus a sticky bottom bar on mobile that
// appears once the main buy box scrolls out of view. Replaces QuantitySelector.
export default function BuyBox({ productId, stock, name, price }) {
  const [quantity, setQuantity] = useState(1);
  const [showSticky, setShowSticky] = useState(false);
  const boxRef = useRef(null);
  const outOfStock = stock <= 0;

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setShowSticky(!entry.isIntersecting),
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div ref={boxRef} className="flex items-center gap-3">
        {!outOfStock && (
          <div className="flex items-center gap-1 border border-gray-200 rounded-xl shrink-0">
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              disabled={quantity <= 1}
              className="w-9 h-11 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-l-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all duration-150"
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="w-9 text-center text-sm font-medium text-gray-900 tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => Math.min(stock, q + 1))}
              disabled={quantity >= stock}
              className="w-9 h-11 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-r-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all duration-150"
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        )}
        <AddToCartButton productId={productId} stock={stock} quantity={quantity} />
      </div>

      {/* Mobile sticky bar — sits just above the fixed bottom nav (60px + safe area) */}
      <div
        inert={!showSticky}
        className={`md:hidden fixed bottom-[60px] inset-x-0 z-20 bg-white border-t border-gray-200 px-4 pt-3 pb-3 flex items-center gap-3 transition-transform duration-200 ${
          showSticky ? 'translate-y-0' : 'translate-y-full'
        }`}
        style={{ bottom: 'calc(60px + env(safe-area-inset-bottom))' }}
      >
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-900 truncate">{name}</p>
          <p className="text-xs text-gray-400">
            ${price}
            {quantity > 1 ? ` × ${quantity}` : ''}
          </p>
        </div>
        <AddToCartButton productId={productId} stock={stock} quantity={quantity} />
      </div>
    </>
  );
}
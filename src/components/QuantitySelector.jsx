'use client';
import { useState } from 'react';
import AddToCartButton from '@/components/AddToCartButton';

export default function QuantitySelector({ productId, stock }) {
  const [quantity, setQuantity] = useState(1);
  const outOfStock = stock <= 0;

  return (
    <div className="flex items-center gap-3">
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
  );
}
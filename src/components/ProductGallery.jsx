'use client';
import { useState } from 'react';
import ProductImage from '@/components/ProductImage';

export default function ProductGallery({ images = [], alt, discountBadge }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const hasMultiple = images.length > 1;
  const activeSrc = images[activeIndex];

  return (
    <div className="flex flex-col gap-3">
      <div className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100">
        <ProductImage
          src={activeSrc}
          alt={alt}
          className="w-full h-80 md:h-96 object-cover"
        />
        {discountBadge}
      </div>

      {hasMultiple && (
        <div className="flex gap-2.5 overflow-x-auto pb-1">
          {images.map((src, i) => (
            <button
              key={src + i}
              type="button"
              onClick={() => setActiveIndex(i)}
              className={`relative shrink-0 w-16 h-16 rounded-xl overflow-hidden border-2 transition-all duration-150 ${
                i === activeIndex
                  ? 'border-gray-900'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <ProductImage src={src} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
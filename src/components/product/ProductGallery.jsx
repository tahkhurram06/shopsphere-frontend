"use client";
import { useEffect, useState } from "react";
import ProductImage from "@/components/product/ProductImage";

export default function ProductGallery({ images = [], alt, discountBadge }) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [zoom, setZoom] = useState({ on: false, x: 50, y: 50 });
  const [lightbox, setLightbox] = useState(false);
  const hasMultiple = images.length > 1;
  const activeSrc = images[activeIndex];

  const next = () => setActiveIndex((i) => (i + 1) % images.length);
  const prev = () =>
    setActiveIndex((i) => (i - 1 + images.length) % images.length);

  // Lightbox: Esc closes, arrows navigate, page scroll locked while open
  useEffect(() => {
    if (!lightbox) return;
    const onKey = (e) => {
      if (e.key === "Escape") setLightbox(false);
      else if (e.key === "ArrowRight" && images.length > 1) next();
      else if (e.key === "ArrowLeft" && images.length > 1) prev();
    };
    document.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [lightbox, images.length]);

  // Hover zoom for mouse only; touch users tap to open the lightbox instead
  const handlePointerMove = (e) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    setZoom({
      on: true,
      x: ((e.clientX - r.left) / r.width) * 100,
      y: ((e.clientY - r.top) / r.height) * 100,
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div
        role="button"
        tabIndex={0}
        aria-label="Open image viewer"
        onPointerMove={handlePointerMove}
        onPointerLeave={() => setZoom((z) => ({ ...z, on: false }))}
        onClick={() => activeSrc && setLightbox(true)}
        onKeyDown={(e) => e.key === "Enter" && activeSrc && setLightbox(true)}
        className="relative rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 cursor-zoom-in"
      >
        <div
          className="transition-transform duration-200 ease-out"
          style={{
            transform: zoom.on ? "scale(2)" : "scale(1)",
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
          }}
        >
          <ProductImage
            src={activeSrc}
            alt={alt}
            className="w-full h-72 sm:h-80 md:h-96 max-h-[55vh] object-cover"
          />
        </div>
        {discountBadge}
        {activeSrc && (
          <span className="pointer-events-none absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur flex items-center justify-center text-gray-500 shadow-sm">
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16zM11 8v6M8 11h6"
              />
            </svg>
          </span>
        )}
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
                  ? "border-gray-900"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <ProductImage
                src={src}
                alt=""
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      {lightbox && activeSrc && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          onClick={() => setLightbox(false)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 animate-fade-in"
        >
          <button
            type="button"
            onClick={() => setLightbox(false)}
            aria-label="Close"
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center hover:bg-white active:scale-90 transition-all duration-150"
          >
            ✕
          </button>

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                prev();
              }}
              aria-label="Previous image"
              className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center hover:bg-white active:scale-90 transition-all duration-150"
            >
              ←
            </button>
          )}

          <div onClick={(e) => e.stopPropagation()} className="max-w-full">
            <ProductImage
              src={activeSrc}
              alt={alt}
              className="max-h-[85vh] max-w-full object-contain rounded-xl"
            />
          </div>

          {hasMultiple && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                next();
              }}
              aria-label="Next image"
              className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-white/90 text-gray-900 flex items-center justify-center hover:bg-white active:scale-90 transition-all duration-150"
            >
              →
            </button>
          )}
        </div>
      )}
    </div>
  );
}

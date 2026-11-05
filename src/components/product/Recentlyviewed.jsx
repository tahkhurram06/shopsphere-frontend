"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import ProductImage from "@/components/product/ProductImage";

const KEY = "recentlyViewed";
const MAX_STORED = 10;
const MAX_SHOWN = 4;

// Records the current product, and lists the other recently viewed ones.
export default function RecentlyViewed({ product }) {
  const [items, setItems] = useState([]);

  const productId = product?._id;

  useEffect(() => {
    if (!productId) return;
    let list = [];
    try {
      const parsed = JSON.parse(localStorage.getItem(KEY) || "[]");
      if (Array.isArray(parsed)) list = parsed;
    } catch {}

    setItems(list.filter((p) => p._id !== productId).slice(0, MAX_SHOWN));

    const updated = [product, ...list.filter((p) => p._id !== productId)].slice(
      0,
      MAX_STORED,
    );
    try {
      localStorage.setItem(KEY, JSON.stringify(updated));
    } catch {}
  }, [productId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (items.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-medium text-gray-900 mb-4">
        Recently viewed
      </h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {items.map((p) => {
          const discounted = p.discountPercentage > 0;
          const price = discounted
            ? (p.price * (1 - p.discountPercentage / 100)).toFixed(2)
            : p.price;
          return (
            <Link
              key={p._id}
              href={`/products/${p._id}`}
              className="group border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-900/[0.02] transition-all duration-300 hover:shadow-md hover:shadow-gray-900/[0.06] hover:-translate-y-0.5"
            >
              <div className="w-full h-36 overflow-hidden bg-gray-100">
                <ProductImage
                  src={p.image}
                  alt={p.name}
                  className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="p-3">
                <h3 className="text-sm font-medium text-gray-900 truncate">
                  {p.name}
                </h3>
                <p className="text-sm text-gray-900 mt-0.5 flex items-baseline gap-1.5">
                  ${price}
                  {discounted && (
                    <span className="text-xs text-gray-400 line-through">
                      ${p.price}
                    </span>
                  )}
                </p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

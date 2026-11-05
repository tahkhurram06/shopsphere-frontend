"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import FilterDropdown from "./FilterDropdown";

const SORT_OPTIONS = [
  { value: "", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Top rated" },
];

const RATING_OPTIONS = [
  { value: "", label: "Any rating" },
  { value: "4", label: "4★ & up" },
  { value: "3", label: "3★ & up" },
  { value: "2", label: "2★ & up" },
];

const priceInputClass =
  "w-full border border-gray-200 rounded-xl pl-6 pr-2.5 py-2.5 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5";

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const urlKeyword = searchParams.get("keyword") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "";
  const urlMin = searchParams.get("minPrice") || "";
  const urlMax = searchParams.get("maxPrice") || "";
  const rating = searchParams.get("rating") || "";
  const inStock = searchParams.get("inStock") === "1";

  const [keyword, setKeyword] = useState(urlKeyword);
  const [minPrice, setMinPrice] = useState(urlMin);
  const [maxPrice, setMaxPrice] = useState(urlMax);
  const debounceRef = useRef(null);
  const priceRef = useRef(null);

  // Keep inputs in sync if the URL changes from elsewhere (back/forward, header search, chips)
  useEffect(() => {
    setKeyword(urlKeyword);
    setMinPrice(urlMin);
    setMaxPrice(urlMax);
  }, [urlKeyword, urlMin, urlMax]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    // Any filter change goes back to page 1
    if (!("page" in updates)) params.delete("page");
    const qs = params.toString();
    router.push(`${pathname}${qs ? `?${qs}` : ""}#products`);
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ keyword: value });
    }, 400);
  };

  const handlePriceChange = (which, raw) => {
    const clean = raw.replace(/[^\d.]/g, "");
    const nextMin = which === "min" ? clean : minPrice;
    const nextMax = which === "max" ? clean : maxPrice;
    setMinPrice(nextMin);
    setMaxPrice(nextMax);
    if (priceRef.current) clearTimeout(priceRef.current);
    priceRef.current = setTimeout(() => {
      updateParams({ minPrice: nextMin, maxPrice: nextMax });
    }, 600);
  };

  const categoryOptions = [
    { value: "", label: "All categories" },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  // Active filter chips (sort is an ordering, not a filter, so it has no chip)
  const chips = [];
  if (urlKeyword)
    chips.push({
      id: "keyword",
      label: `“${urlKeyword}”`,
      clear: { keyword: "" },
    });
  if (category)
    chips.push({ id: "category", label: category, clear: { category: "" } });
  if (urlMin || urlMax) {
    const label =
      urlMin && urlMax
        ? `$${urlMin} – $${urlMax}`
        : urlMin
          ? `Over $${urlMin}`
          : `Under $${urlMax}`;
    chips.push({ id: "price", label, clear: { minPrice: "", maxPrice: "" } });
  }
  if (rating)
    chips.push({
      id: "rating",
      label: `${rating}★ & up`,
      clear: { rating: "" },
    });
  if (inStock)
    chips.push({ id: "inStock", label: "In stock", clear: { inStock: "" } });

  return (
    <div className="flex flex-col gap-3 mb-8">
      {/* Row 1: search, category, sort */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={1.8}
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z"
            />
          </svg>
          <input
            type="text"
            placeholder="Search by name or brand..."
            value={keyword}
            onChange={(e) => handleKeywordChange(e.target.value)}
            className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
          />
        </div>

        <FilterDropdown
          value={category}
          options={categoryOptions}
          onChange={(value) => updateParams({ category: value })}
          placeholder="All categories"
        />

        <FilterDropdown
          value={sort}
          options={SORT_OPTIONS}
          onChange={(value) => updateParams({ sort: value })}
          placeholder="Newest"
        />
      </div>

      {/* Row 2: price, rating, in stock */}
      <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-3">
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-gray-500">Price</span>
          <div className="relative w-20 sm:w-24">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Min"
              value={minPrice}
              onChange={(e) => handlePriceChange("min", e.target.value)}
              aria-label="Minimum price"
              className={priceInputClass}
            />
          </div>
          <span className="text-gray-300">–</span>
          <div className="relative w-24">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400">
              $
            </span>
            <input
              type="text"
              inputMode="decimal"
              placeholder="Max"
              value={maxPrice}
              onChange={(e) => handlePriceChange("max", e.target.value)}
              aria-label="Maximum price"
              className={priceInputClass}
            />
          </div>
        </div>

        <FilterDropdown
          value={rating}
          options={RATING_OPTIONS}
          onChange={(value) => updateParams({ rating: value })}
          placeholder="Any rating"
        />

        <button
          type="button"
          role="switch"
          aria-checked={inStock}
          onClick={() => updateParams({ inStock: inStock ? "" : "1" })}
          className="flex items-center gap-2.5 text-sm text-gray-600 select-none"
        >
          <span
            className={`relative w-9 h-5 rounded-full border transition-colors duration-150 ${
              inStock
                ? "bg-gray-900 border-gray-900"
                : "bg-gray-100 border-gray-200"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 w-3.5 h-3.5 rounded-full bg-white shadow-sm transition-transform duration-150 ${
                inStock ? "translate-x-4" : ""
              }`}
            />
          </span>
          In stock only
        </button>
      </div>

      {/* Row 3: active filter chips */}
      {chips.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 animate-fade-in">
          {chips.map((chip) => (
            <button
              key={chip.id}
              type="button"
              onClick={() => updateParams(chip.clear)}
              className="inline-flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 pl-3 pr-2 py-1 text-xs text-gray-700 capitalize transition-colors duration-150 hover:border-gray-300"
              aria-label={`Remove filter ${chip.label}`}
            >
              {chip.label}
              <span className="text-gray-400 text-[11px]">✕</span>
            </button>
          ))}
          <button
            type="button"
            onClick={() => {
              setKeyword("");
              setMinPrice("");
              setMaxPrice("");
              router.push(`${pathname}#products`);
            }}
            className="text-xs text-gray-500 hover:text-gray-900 px-2 py-1 transition-colors duration-150"
          >
            Clear all
          </button>
        </div>
      )}
    </div>
  );
}

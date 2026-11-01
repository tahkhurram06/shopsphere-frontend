'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import FilterDropdown from './FilterDropdown';

const SORT_OPTIONS = [
  { value: '', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Top rated' },
];

export default function ShopFilters({ categories }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('keyword') || '');
  const category = searchParams.get('category') || '';
  const sort = searchParams.get('sort') || '';
  const debounceRef = useRef(null);

  // Keep the input in sync if the URL changes from elsewhere (e.g. back/forward)
  useEffect(() => {
    setKeyword(searchParams.get('keyword') || '');
  }, [searchParams]);

  const updateParams = (updates) => {
    const params = new URLSearchParams(searchParams.toString());
    Object.entries(updates).forEach(([key, value]) => {
      if (value) params.set(key, value);
      else params.delete(key);
    });
    router.push(`${pathname}?${params.toString()}`);
  };

  const handleKeywordChange = (value) => {
    setKeyword(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      updateParams({ keyword: value });
    }, 400);
  };

  const categoryOptions = [
    { value: '', label: 'All categories' },
    ...categories.map((c) => ({ value: c, label: c })),
  ];

  const hasActiveFilters = keyword || category || sort;

  return (
    <div className="flex flex-col sm:flex-row gap-3 mb-8">
      {/* Search */}
      <div className="relative flex-1">
        <svg
          className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.8}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z" />
        </svg>
        <input
          type="text"
          placeholder="Search by name or brand..."
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="w-full border border-gray-200 rounded-xl pl-10 pr-3.5 py-2.5 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
        />
      </div>

      {/* Category */}
      <FilterDropdown
        value={category}
        options={categoryOptions}
        onChange={(value) => updateParams({ category: value })}
        placeholder="All categories"
      />

      {/* Sort */}
      <FilterDropdown
        value={sort}
        options={SORT_OPTIONS}
        onChange={(value) => updateParams({ sort: value })}
        placeholder="Newest"
      />

      {hasActiveFilters && (
        <button
          onClick={() => {
            setKeyword('');
            router.push(pathname);
          }}
          className="text-sm text-gray-500 hover:text-gray-900 px-3 py-2.5 transition-colors duration-150 shrink-0"
        >
          Clear
        </button>
      )}
    </div>
  );
}
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import ProductImage from "@/components/product/ProductImage";

function finalPrice(p) {
  return p.discountPercentage > 0
    ? (p.price * (1 - p.discountPercentage / 100)).toFixed(2)
    : p.price;
}

function SearchBox({ onDone, autoFocus = false }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const wrapRef = useRef(null);
  const trimmed = query.trim();

  // Close the dropdown when clicking elsewhere
  useEffect(() => {
    const handle = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  // Debounced suggestions
  useEffect(() => {
    if (trimmed.length < 2) {
      setResults([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/products?keyword=${encodeURIComponent(trimmed)}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("search failed");
        const data = await res.json();
        setResults(Array.isArray(data) ? data.slice(0, 5) : []);
        setActive(-1);
      } catch (err) {
        if (err.name !== "AbortError") setResults([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 250);
    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [trimmed]);

  const finish = () => {
    setOpen(false);
    onDone?.();
  };

  const goSearch = () => {
    if (!trimmed) return;
    finish();
    router.push(`/?keyword=${encodeURIComponent(trimmed)}#products`);
  };

  const goProduct = (id) => {
    finish();
    router.push(`/products/${id}`);
  };

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActive((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((i) => Math.max(i - 1, -1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (active >= 0 && results[active]) goProduct(results[active]._id);
      else goSearch();
    } else if (e.key === "Escape") {
      finish();
    }
  };

  const showDropdown = open && trimmed.length >= 2;

  return (
    <div ref={wrapRef} className="relative w-full">
      <svg
        className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300 pointer-events-none"
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
        value={query}
        autoFocus={autoFocus}
        onChange={(e) => {
          setQuery(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onKeyDown={handleKeyDown}
        placeholder="Search products..."
        aria-label="Search products"
        className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-10 pr-3.5 py-2 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5"
      />

      {showDropdown && (
        <div className="absolute left-0 right-0 top-full mt-1.5 z-30 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-900/10 overflow-hidden animate-fade-in">
          {loading && results.length === 0 ? (
            <p className="px-3.5 py-3 text-sm text-gray-400">Searching...</p>
          ) : results.length === 0 ? (
            <p className="px-3.5 py-3 text-sm text-gray-400">
              No matches for “{trimmed}”
            </p>
          ) : (
            <>
              {results.map((p, i) => (
                <button
                  key={p._id}
                  type="button"
                  onClick={() => goProduct(p._id)}
                  onMouseEnter={() => setActive(i)}
                  className={`w-full flex items-center gap-3 px-3 py-2 text-left transition-colors duration-100 ${
                    i === active ? "bg-gray-100" : "hover:bg-gray-50"
                  }`}
                >
                  <ProductImage
                    src={p.images?.[0]}
                    alt=""
                    className="w-10 h-10 rounded-lg object-cover shrink-0"
                  />
                  <span className="flex-1 min-w-0">
                    <span className="block text-sm font-medium text-gray-900 truncate">
                      {p.name}
                    </span>
                    <span className="block text-xs text-gray-400 truncate">
                      {p.brand}
                    </span>
                  </span>
                  <span className="text-sm text-gray-900 shrink-0">
                    ${finalPrice(p)}
                  </span>
                </button>
              ))}
              <button
                type="button"
                onClick={goSearch}
                className="w-full border-t border-gray-100 px-3.5 py-2.5 text-left text-sm text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-100"
              >
                See all results for “{trimmed}”
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function MobileSearch() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label="Search"
        title="Search"
        className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 shadow-sm shadow-gray-900/5 hover:text-gray-900 active:scale-90 transition-all duration-150"
      >
        <svg
          className="w-4.5 h-4.5"
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
      </button>
      {open && (
        <div className="fixed left-0 right-0 top-16 bg-white border-b border-gray-200 px-4 py-3 shadow-sm animate-fade-in z-30">
          <SearchBox autoFocus onDone={() => setOpen(false)} />
        </div>
      )}
    </div>
  );
}

export default function SearchBar({ variant = "desktop" }) {
  return variant === "mobile" ? <MobileSearch /> : <SearchBox />;
}

"use client";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";

export default function Header() {
  const { user, logout, loading } = useAuth();
  const { count } = useCart();
  const { count: wishlistCount } = useWishlist();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target))
        setMenuOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (loading) return null;

  return (
    <header className="sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex justify-between items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2.5 shrink-0 transition-opacity duration-150 hover:opacity-70"
        >
          <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center shrink-0">
            <span className="text-white text-sm font-medium">S</span>
          </div>
          <span className="font-medium text-gray-900 hidden sm:inline">
            ShopSphere
          </span>
        </Link>

        <div className="flex items-center gap-1.5 sm:gap-2">
          <ThemeToggle />

          <Link
            href="/wishlist"
            aria-label={`Wishlist${wishlistCount > 0 ? `, ${wishlistCount} item${wishlistCount !== 1 ? "s" : ""}` : ""}`}
            title="Wishlist"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 shadow-sm shadow-gray-900/5 hover:shadow-md hover:shadow-gray-900/10 hover:text-gray-900 hover:-translate-y-0.5 active:scale-90 active:translate-y-0 transition-all duration-150"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
              />
            </svg>
            {wishlistCount > 0 && (
              <span
                key={wishlistCount}
                className="animate-fade-in absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-medium flex items-center justify-center leading-none"
              >
                {wishlistCount > 99 ? "99+" : wishlistCount}
              </span>
            )}
          </Link>
          <Link
            href="/cart"
            aria-label={`Cart${count > 0 ? `, ${count} item${count !== 1 ? "s" : ""}` : ""}`}
            title="Cart"
            className="relative w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 shadow-sm shadow-gray-900/5 hover:shadow-md hover:shadow-gray-900/10 hover:text-gray-900 hover:-translate-y-0.5 active:scale-90 active:translate-y-0 transition-all duration-150"
          >
            <svg
              className="w-[18px] h-[18px]"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 1.994-4.705 2.602-7.189.077-.316-.164-.611-.49-.611H5.106M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z"
              />
            </svg>
            {count > 0 && (
              <span
                key={count}
                className="animate-fade-in absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 rounded-full bg-red-600 text-white text-[10px] font-medium flex items-center justify-center leading-none"
              >
                {count > 99 ? "99+" : count}
              </span>
            )}
          </Link>

          {user ? (
            <>
              <Link
                href="/orders"
                aria-label="Orders"
                title="Orders"
                className="w-10 h-10 flex items-center justify-center rounded-xl text-gray-500 bg-white border border-gray-200 shadow-sm shadow-gray-900/5 hover:shadow-md hover:shadow-gray-900/10 hover:text-gray-900 hover:-translate-y-0.5 active:scale-90 active:translate-y-0 transition-all duration-150"
              >
                <svg
                  className="w-[18px] h-[18px]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.8}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"
                  />
                </svg>
              </Link>

              <div ref={menuRef} className="relative ml-1">
                <button
                  onClick={() => setMenuOpen((v) => !v)}
                  className="w-10 h-10 rounded-full bg-gray-900 text-white flex items-center justify-center text-xs font-medium hover:opacity-90 active:scale-90 transition-all duration-150"
                >
                  {user?.name?.slice(0, 2).toUpperCase() || "U"}
                </button>

                {menuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-xl shadow-lg shadow-gray-900/10 overflow-hidden animate-fade-in">
                    <div className="px-3.5 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user?.name}
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                        {user?.email}
                      </p>
                    </div>
                    <Link
                      href="/wishlist"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z"
                        />
                      </svg>
                      Wishlist
                    </Link>
                    <Link
                      href="/orders"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M9 14.25l6-6m4.5-3.493V21.75l-3.75-1.5-3.75 1.5-3.75-1.5-3.75 1.5V4.757c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0c1.1.128 1.907 1.077 1.907 2.185z"
                        />
                      </svg>
                      Your orders
                    </Link>
                    <Link
                      href="/account"
                      onClick={() => setMenuOpen(false)}
                      className="flex items-center gap-2 px-3.5 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-100"
                    >
                      <svg
                        className="w-4 h-4 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={1.8}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z"
                        />
                      </svg>
                      Account
                    </Link>
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full flex items-center gap-2 text-left px-3.5 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors duration-100"
                    >
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
                          d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l3 3m0 0l-3 3m3-3H3"
                        />
                      </svg>
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2 ml-1">
              <Link
                href="/login"
                className="text-xs font-medium text-gray-600 bg-gray-100 rounded-lg px-3.5 py-2 hover:bg-gray-900 hover:text-white active:scale-95 transition-all duration-150"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-xs font-medium text-white bg-gray-900 rounded-lg px-3.5 py-2 hover:bg-gray-800 active:scale-95 transition-all duration-150"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";

const items = [
  {
    href: "/",
    label: "Home",
    match: (path) => path === "/",
    icon: (active) => (
      <svg
        className="w-[22px] h-[22px]"
        fill={active ? "currentColor" : "none"}
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={1.8}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75"
        />
      </svg>
    ),
  },
  {
    href: "/wishlist",
    label: "Wishlist",
    match: (path) => path.startsWith("/wishlist"),
    icon: (active) => (
      <svg
        className="w-[22px] h-[22px]"
        fill={active ? "currentColor" : "none"}
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
    ),
    badgeKey: "wishlist",
  },
  {
    href: "/cart",
    label: "Cart",
    match: (path) => path.startsWith("/cart"),
    icon: (active) => (
      <svg
        className="w-[22px] h-[22px]"
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
    ),
    badgeKey: "cart",
  },
  {
    href: "/account",
    label: "Account",
    match: (path) => path.startsWith("/account"),
    icon: (active) => (
      <svg
        className="w-[22px] h-[22px]"
        fill={active ? "currentColor" : "none"}
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
    ),
  },
];

// Fixed bottom tab bar, mobile only (hidden sm and up). Sits above the
// safe-area inset so it clears the home indicator on iOS.
export default function MobileBottomNav() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { count: cartCount } = useCart();
  const { count: wishlistCount } = useWishlist();

  const badges = { cart: cartCount, wishlist: wishlistCount };

  return (
    <nav
      aria-label="Primary"
      className="sm:hidden fixed bottom-0 inset-x-0 z-30 bg-white/90 backdrop-blur border-t border-gray-200 pb-[env(safe-area-inset-bottom)]"
    >
      <div className="flex items-stretch justify-around h-[60px]">
        {items.map((item) => {
          const active = item.match(pathname);
          const href = item.href === "/account" && !user ? "/login" : item.href;
          const badgeCount = item.badgeKey ? badges[item.badgeKey] : 0;
          return (
            <Link
              key={item.href}
              href={href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className="relative flex-1 flex flex-col items-center justify-center gap-1 transition-colors duration-150 active:scale-95"
            >
              <span className={active ? "text-gray-900" : "text-gray-400"}>
                {item.icon(active)}
                {badgeCount > 0 && (
                  <span className="absolute top-1 right-[calc(50%-18px)] min-w-[16px] h-[16px] px-1 rounded-full bg-red-600 text-white text-[9px] font-medium flex items-center justify-center leading-none">
                    {badgeCount > 99 ? "99+" : badgeCount}
                  </span>
                )}
              </span>
              <span
                className={`text-[10px] font-medium ${active ? "text-gray-900" : "text-gray-400"}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

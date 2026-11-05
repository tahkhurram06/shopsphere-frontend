"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import { useWishlist } from "@/context/WishlistContext";
import Header from "@/components/layout/Header";
import ProductImage from "@/components/product/ProductImage";
import CheckoutSteps from "@/components/checkout/CheckoutSteps";
import FreeShippingBar from "@/components/checkout/FreeShippingBar";
import OrderSummary from "@/components/checkout/OrderSummary";
import { CartSkeleton } from "@/components/common/Skeletons";
import {
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_FEE,
  calcTotals,
  money,
  unitPrice,
} from "@/lib/checkout";

const API = process.env.NEXT_PUBLIC_API_URL;
const ADDRESS_KEY = "shippingAddress";
const emptyAddress = { address: "", city: "", postalCode: "", country: "" };

const labelClass = "text-xs font-medium text-gray-500";
const fieldClass = (hasError) =>
  `w-full border rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150 focus:ring-4 focus:ring-gray-900/5 ${
    hasError
      ? "border-red-200"
      : "border-gray-200 hover:border-gray-300 focus:border-gray-900"
  }`;

const primaryBtn =
  "w-full bg-gray-900 text-white rounded-xl px-6 py-3 text-sm font-medium transition-all duration-150 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none flex items-center justify-center gap-2";

const Spinner = () => (
  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
);

export default function CartPage() {
  const { user, token, loading } = useAuth();
  const { toast } = useToast();
  const { refreshCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const router = useRouter();

  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [stage, setStage] = useState("cart"); // "cart" | "address" | "review"
  const [paying, setPaying] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState(emptyAddress);
  const [addressErrors, setAddressErrors] = useState({});

  // Remember the last address used on this device
  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(ADDRESS_KEY) || "null");
      if (saved && typeof saved === "object") {
        setShippingAddress({ ...emptyAddress, ...saved });
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (token) fetchCart();
  }, [loading, user, token]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${API}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load cart");
      setCart(await res.json());
    } catch (err) {
      setError(err.message);
    }
  };

  const goTo = (next) => {
    setError("");
    setStage(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const updateQuantity = async (productId, quantity, stock) => {
    if (quantity < 1) return;
    if (stock && quantity > stock) {
      toast({ message: `Only ${stock} in stock.`, type: "error" });
      return;
    }

    setUpdatingId(productId);
    try {
      const res = await fetch(`${API}/cart/${productId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ quantity }),
      });
      if (!res.ok) throw new Error("Failed to update item");
      await fetchCart();
      refreshCart();
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setUpdatingId(null);
    }
  };

  const removeFromCart = async (productId) => {
    const res = await fetch(`${API}/cart/${productId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error("Failed to remove item");
    await fetchCart();
    refreshCart();
  };

  const handleRemove = async (productId) => {
    setBusyId(productId);
    try {
      await removeFromCart(productId);
      toast({ message: "Item removed.", type: "success" });
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const handleMoveToWishlist = async (productId) => {
    setBusyId(productId);
    try {
      // toggleWishlist would REMOVE it if already saved, so only call it when needed
      if (!isInWishlist(productId)) await toggleWishlist(productId);
      await removeFromCart(productId);
      toast({ message: "Moved to wishlist.", type: "success" });
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setBusyId(null);
    }
  };

  const setField = (key, value) => {
    setShippingAddress((prev) => ({ ...prev, [key]: value }));
    if (addressErrors[key])
      setAddressErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleAddressSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    for (const key of Object.keys(emptyAddress)) {
      if (!shippingAddress[key].trim()) errs[key] = "Required";
    }
    setAddressErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const clean = Object.fromEntries(
      Object.entries(shippingAddress).map(([k, v]) => [k, v.trim()]),
    );
    setShippingAddress(clean);
    try {
      localStorage.setItem(ADDRESS_KEY, JSON.stringify(clean));
    } catch {}
    goTo("review");
  };

  const handlePay = async () => {
    setError("");
    setPaying(true);
    try {
      const orderRes = await fetch(`${API}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.message || "Checkout failed");

      // Dev tripwire: the backend sets the real charge. If it differs from the
      // total shown here, the backend isn't applying the same discount/shipping rules.
      if (
        typeof order.totalPrice === "number" &&
        Math.abs(order.totalPrice - totals.total) > 0.01
      ) {
        console.warn(
          `[checkout] Backend order total (${order.totalPrice}) differs from displayed total (${totals.total}).`,
        );
      }

      const sessionRes = await fetch(
        `${API}/orders/${order._id}/create-checkout-session`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        },
      );
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok)
        throw new Error(sessionData.message || "Failed to start payment");

      refreshCart();
      window.location.href = sessionData.url;
    } catch (err) {
      setError(err.message);
      setPaying(false);
    }
  };

  if (loading || (!cart && !error)) {
    return (
      <>
        <Header />
        <CartSkeleton />
      </>
    );
  }

  if (!cart) {
    return (
      <>
        <Header />
        <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        </main>
      </>
    );
  }

  const validItems = cart.items.filter((item) => item.product);
  const totals = calcTotals(validItems);
  const hasOutOfStock = validItems.some((item) => item.product.stock === 0);
  const shippingEnabled = SHIPPING_FEE > 0;

  const heading =
    stage === "cart"
      ? "Your cart"
      : stage === "address"
        ? "Shipping address"
        : "Review your order";

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-10">
        {stage !== "cart" && validItems.length > 0 && (
          <CheckoutSteps current={paying ? 2 : stage === "address" ? 0 : 1} />
        )}

        <h1 className="text-2xl font-medium text-gray-900 mb-6">{heading}</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-fade-in">
            {error}
          </div>
        )}

        {validItems.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-medium text-gray-900 mb-1.5">
              Your cart is empty
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Browse the shop to add something.
            </p>
            <Link
              href="/"
              className="bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
            >
              Continue shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_340px] gap-8 items-start">
            <div key={stage} className="animate-fade-in">
              {/* ---------- Stage: cart ---------- */}
              {stage === "cart" && (
                <>
                  {shippingEnabled && (
                    <FreeShippingBar
                      merchandise={totals.merchandise}
                      threshold={FREE_SHIPPING_THRESHOLD}
                    />
                  )}

                  <div className="flex flex-col gap-3">
                    {validItems.map((item) => {
                      const { product } = item;
                      const unit = unitPrice(product);
                      const discounted = unit < product.price;
                      const atMax =
                        product.stock > 0 && item.quantity >= product.stock;
                      const updating = updatingId === product._id;
                      const busy = busyId === product._id;

                      return (
                        <div
                          key={product._id}
                          className={`border border-gray-200 rounded-2xl p-4 flex gap-4 transition-opacity duration-200 ${
                            busy ? "opacity-50 pointer-events-none" : ""
                          }`}
                        >
                          <Link
                            href={`/products/${product._id}`}
                            className="shrink-0"
                          >
                            <ProductImage
                              src={product.images?.[0]}
                              alt={product.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-xl"
                            />
                          </Link>

                          <div className="flex-1 min-w-0 flex flex-col">
                            <div className="flex justify-between gap-3">
                              <div className="min-w-0">
                                <Link href={`/products/${product._id}`}>
                                  <h2 className="font-medium text-gray-900 truncate hover:underline">
                                    {product.name}
                                  </h2>
                                </Link>
                                <p className="text-sm text-gray-400">
                                  {money(unit)} each
                                  {discounted && (
                                    <span className="ml-1.5 line-through">
                                      {money(product.price)}
                                    </span>
                                  )}
                                </p>
                                {product.stock === 0 && (
                                  <p className="text-red-500 text-xs mt-1">
                                    Now out of stock
                                  </p>
                                )}
                              </div>
                              <p className="text-sm font-medium text-gray-900 shrink-0">
                                {money(unit * item.quantity)}
                              </p>
                            </div>

                            <div className="mt-auto pt-3 flex flex-wrap items-center justify-between gap-3">
                              <div className="flex items-center gap-1 border border-gray-200 rounded-xl">
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      item.quantity - 1,
                                      product.stock,
                                    )
                                  }
                                  disabled={updating || item.quantity <= 1}
                                  className="w-8 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-l-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all duration-150"
                                  aria-label="Decrease quantity"
                                >
                                  −
                                </button>
                                <span className="w-8 text-center text-sm font-medium text-gray-900 tabular-nums">
                                  {item.quantity}
                                </span>
                                <button
                                  type="button"
                                  onClick={() =>
                                    updateQuantity(
                                      product._id,
                                      item.quantity + 1,
                                      product.stock,
                                    )
                                  }
                                  disabled={updating || atMax}
                                  className="w-8 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-r-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all duration-150"
                                  aria-label="Increase quantity"
                                >
                                  +
                                </button>
                              </div>

                              <div className="flex items-center gap-4 text-sm font-medium">
                                <button
                                  type="button"
                                  onClick={() =>
                                    handleMoveToWishlist(product._id)
                                  }
                                  className="text-gray-500 hover:text-gray-900 transition-colors duration-150"
                                >
                                  Move to wishlist
                                </button>
                                <button
                                  type="button"
                                  onClick={() => handleRemove(product._id)}
                                  className="text-red-500 hover:text-red-700 transition-colors duration-150"
                                >
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </>
              )}

              {/* ---------- Stage: address ---------- */}
              {stage === "address" && (
                <>
                  <form
                    id="address-form"
                    onSubmit={handleAddressSubmit}
                    noValidate
                    className="border border-gray-200 rounded-2xl p-5 sm:p-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="address" className={labelClass}>
                        Street address
                      </label>
                      <input
                        id="address"
                        type="text"
                        autoComplete="street-address"
                        value={shippingAddress.address}
                        onChange={(e) => setField("address", e.target.value)}
                        className={fieldClass(addressErrors.address)}
                      />
                      {addressErrors.address && (
                        <span className="text-xs text-red-500">
                          {addressErrors.address}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="city" className={labelClass}>
                        City
                      </label>
                      <input
                        id="city"
                        type="text"
                        autoComplete="address-level2"
                        value={shippingAddress.city}
                        onChange={(e) => setField("city", e.target.value)}
                        className={fieldClass(addressErrors.city)}
                      />
                      {addressErrors.city && (
                        <span className="text-xs text-red-500">
                          {addressErrors.city}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="postalCode" className={labelClass}>
                        Postal code
                      </label>
                      <input
                        id="postalCode"
                        type="text"
                        autoComplete="postal-code"
                        value={shippingAddress.postalCode}
                        onChange={(e) => setField("postalCode", e.target.value)}
                        className={fieldClass(addressErrors.postalCode)}
                      />
                      {addressErrors.postalCode && (
                        <span className="text-xs text-red-500">
                          {addressErrors.postalCode}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-1.5 sm:col-span-2">
                      <label htmlFor="country" className={labelClass}>
                        Country
                      </label>
                      <input
                        id="country"
                        type="text"
                        autoComplete="country-name"
                        value={shippingAddress.country}
                        onChange={(e) => setField("country", e.target.value)}
                        className={fieldClass(addressErrors.country)}
                      />
                      {addressErrors.country && (
                        <span className="text-xs text-red-500">
                          {addressErrors.country}
                        </span>
                      )}
                    </div>
                  </form>

                  <button
                    type="button"
                    onClick={() => goTo("cart")}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
                  >
                    ← Back to cart
                  </button>
                </>
              )}

              {/* ---------- Stage: review ---------- */}
              {stage === "review" && (
                <>
                  <div className="border border-gray-200 rounded-2xl p-5 mb-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="text-sm">
                        <h2 className="font-medium text-gray-900 mb-1.5">
                          Shipping to
                        </h2>
                        <p className="text-gray-600">
                          {shippingAddress.address}
                        </p>
                        <p className="text-gray-600">
                          {shippingAddress.city}, {shippingAddress.postalCode}
                        </p>
                        <p className="text-gray-600">
                          {shippingAddress.country}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => goTo("address")}
                        disabled={paying}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 disabled:opacity-50"
                      >
                        Edit
                      </button>
                    </div>
                  </div>

                  <div className="border border-gray-200 rounded-2xl p-5">
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-medium text-gray-900">
                        Items ({totals.qty})
                      </h2>
                      <button
                        type="button"
                        onClick={() => goTo("cart")}
                        disabled={paying}
                        className="text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors duration-150 disabled:opacity-50"
                      >
                        Edit cart
                      </button>
                    </div>
                    <div className="flex flex-col divide-y divide-gray-100">
                      {validItems.map((item) => {
                        const unit = unitPrice(item.product);
                        return (
                          <div
                            key={item.product._id}
                            className="flex items-center gap-3 py-3 first:pt-0 last:pb-0"
                          >
                            <ProductImage
                              src={item.product.images?.[0]}
                              alt={item.product.name}
                              className="w-14 h-14 object-cover rounded-lg shrink-0"
                            />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-gray-900 truncate">
                                {item.product.name}
                              </p>
                              <p className="text-xs text-gray-400">
                                {money(unit)} × {item.quantity}
                              </p>
                            </div>
                            <p className="text-sm text-gray-900 shrink-0">
                              {money(unit * item.quantity)}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => goTo("address")}
                    disabled={paying}
                    className="mt-4 text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150 disabled:opacity-50"
                  >
                    ← Back to address
                  </button>
                </>
              )}
            </div>

            {/* ---------- Sticky summary + CTA ---------- */}
            <OrderSummary totals={totals}>
              {stage === "cart" && (
                <>
                  <button
                    type="button"
                    onClick={() => goTo("address")}
                    disabled={hasOutOfStock}
                    className={primaryBtn}
                  >
                    Checkout
                  </button>
                  {hasOutOfStock && (
                    <p className="text-xs text-red-500 text-center">
                      Remove out-of-stock items to continue.
                    </p>
                  )}
                  <Link
                    href="/"
                    className="text-sm text-gray-500 hover:text-gray-900 text-center transition-colors duration-150"
                  >
                    Continue shopping
                  </Link>
                </>
              )}

              {stage === "address" && (
                <button
                  type="submit"
                  form="address-form"
                  className={primaryBtn}
                >
                  Continue to review
                </button>
              )}

              {stage === "review" && (
                <>
                  <button
                    type="button"
                    onClick={handlePay}
                    disabled={paying}
                    className={primaryBtn}
                  >
                    {paying && <Spinner />}
                    {paying
                      ? "Redirecting to payment..."
                      : `Pay ${money(totals.total)}`}
                  </button>
                  <p className="text-xs text-gray-400 text-center">
                    You&apos;ll be redirected to Stripe&apos;s secure payment
                    page.
                  </p>
                </>
              )}
            </OrderSummary>
          </div>
        )}
      </main>
    </>
  );
}

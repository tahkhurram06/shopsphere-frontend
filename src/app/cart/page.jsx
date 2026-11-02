"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import Header from "@/components/Header";
import { CartSkeleton } from "@/components/Skeletons";
import ProductImage from "@/components/ProductImage";

const fieldClass =
  "border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm outline-none transition-all duration-150 hover:border-gray-300 focus:border-gray-900 focus:ring-4 focus:ring-gray-900/5";

export default function CartPage() {
  const { user, token, loading } = useAuth();
  const { toast } = useToast();
  const { refreshCart } = useCart();
  const router = useRouter();
  const [cart, setCart] = useState(null);
  const [error, setError] = useState("");
  const [checkingOut, setCheckingOut] = useState(false);
  const [updatingId, setUpdatingId] = useState(null);
  const [shippingAddress, setShippingAddress] = useState({
    address: "",
    city: "",
    postalCode: "",
    country: "",
  });

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
      return;
    }
    if (token) fetchCart();
  }, [loading, user, token]);

  const fetchCart = async () => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to load cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const updateQuantity = async (productId, quantity, stock) => {
    if (quantity < 1) return;
    if (stock && quantity > stock) {
      toast({ message: `Only ${stock} in stock.`, type: "error" });
      return;
    }

    setUpdatingId(productId);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
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

  const removeItem = async (productId) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to remove item");
      fetchCart();
      refreshCart();
      toast({ message: "Item removed.", type: "success" });
    } catch (err) {
      toast({ message: err.message, type: "error" });
    }
  };

  const handleCheckout = async () => {
    setError("");

    if (
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      setError("Please fill in your full shipping address.");
      return;
    }

    setCheckingOut(true);
    try {
      const orderRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ shippingAddress }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) throw new Error(order.message || "Checkout failed");

      const sessionRes = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/orders/${order._id}/create-checkout-session`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const sessionData = await sessionRes.json();
      if (!sessionRes.ok) throw new Error(sessionData.message || "Failed to start payment");

      refreshCart();
      window.location.href = sessionData.url;
    } catch (err) {
      setError(err.message);
      setCheckingOut(false);
    }
  };

  if (loading || !cart) {
    return (
      <>
        <Header />
        <CartSkeleton />
      </>
    );
  }

  const validItems = cart.items.filter((item) => item.product);

  const total = validItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const addressComplete =
    shippingAddress.address.trim() &&
    shippingAddress.city.trim() &&
    shippingAddress.postalCode.trim() &&
    shippingAddress.country.trim();

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 pb-28">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Your cart</h1>

        {error && (
          <div className="mb-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 animate-fade-in">
            {error}
          </div>
        )}

        {validItems.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-medium text-gray-900 mb-1.5">Your cart is empty</h3>
            <p className="text-sm text-gray-400">Browse the shop to add something.</p>
          </div>
        ) : (
          <>
            <div className="flex flex-col gap-3">
              {validItems.map((item) => {
                const subtotal = item.product.price * item.quantity;
                const atMax = item.product.stock > 0 && item.quantity >= item.product.stock;
                const busy = updatingId === item.product._id;

                return (
                  <div
                    key={item.product._id}
                    className="border border-gray-200 rounded-2xl p-4 flex items-center gap-4 transition-shadow duration-200 hover:shadow-md hover:shadow-gray-900/[0.03]"
                  >
                    <ProductImage
                      src={item.product.images?.[0]}
                      alt={item.product.name}
                      className="w-20 h-20 object-cover rounded-xl shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <h2 className="font-medium text-gray-900 truncate">{item.product.name}</h2>
                      <p className="text-gray-400 text-sm">${item.product.price} each</p>
                      {item.product.stock === 0 && (
                        <p className="text-red-500 text-xs mt-1">Now out of stock</p>
                      )}
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center gap-1 border border-gray-200 rounded-xl shrink-0">
                      <button
                        type="button"
                        onClick={() =>
                          updateQuantity(item.product._id, item.quantity - 1, item.product.stock)
                        }
                        disabled={busy || item.quantity <= 1}
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
                          updateQuantity(item.product._id, item.quantity + 1, item.product.stock)
                        }
                        disabled={busy || atMax}
                        className="w-8 h-9 flex items-center justify-center text-gray-500 hover:text-gray-900 hover:bg-gray-50 rounded-r-xl disabled:opacity-30 disabled:cursor-not-allowed active:scale-90 transition-all duration-150"
                        aria-label="Increase quantity"
                      >
                        +
                      </button>
                    </div>

                    <div className="w-20 text-right shrink-0">
                      <p className="text-sm font-medium text-gray-900">${subtotal.toFixed(2)}</p>
                    </div>

                    <button
                      onClick={() => removeItem(item.product._id)}
                      className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors duration-150 shrink-0"
                    >
                      Remove
                    </button>
                  </div>
                );
              })}
            </div>

            <div className="mt-6 border border-gray-200 rounded-2xl p-5">
              <h2 className="text-sm font-medium text-gray-900 mb-4">Shipping address</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder="Street address"
                  value={shippingAddress.address}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, address: e.target.value })
                  }
                  className={`${fieldClass} sm:col-span-2`}
                  required
                />
                <input
                  type="text"
                  placeholder="City"
                  value={shippingAddress.city}
                  onChange={(e) => setShippingAddress({ ...shippingAddress, city: e.target.value })}
                  className={fieldClass}
                  required
                />
                <input
                  type="text"
                  placeholder="Postal code"
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, postalCode: e.target.value })
                  }
                  className={fieldClass}
                  required
                />
                <input
                  type="text"
                  placeholder="Country"
                  value={shippingAddress.country}
                  onChange={(e) =>
                    setShippingAddress({ ...shippingAddress, country: e.target.value })
                  }
                  className={`${fieldClass} sm:col-span-2`}
                  required
                />
              </div>
            </div>

            <div className="mt-6 flex justify-between items-center">
              <span className="text-xl font-medium text-gray-900">
                Total: ${total.toFixed(2)}
              </span>
              <button
                onClick={handleCheckout}
                disabled={checkingOut || !addressComplete}
                className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {checkingOut && (
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                )}
                {checkingOut ? "Redirecting to payment..." : "Checkout"}
              </button>
            </div>
          </>
        )}
      </main>
    </>
  );
}
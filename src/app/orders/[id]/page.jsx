"use client";
import { useCallback, useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useToast } from "@/context/ToastContext";
import { useCart } from "@/context/CartContext";
import Header from "@/components/layout/Header";
import { OrderDetailSkeleton } from "@/components/common/Skeletons";

const statusStyles = {
  pending: "bg-gray-100 text-gray-600",
  processing: "bg-amber-50 text-amber-700",
  shipped: "bg-gray-900 text-white",
  delivered: "bg-emerald-50 text-emerald-700",
  cancelled: "bg-red-50 text-red-700",
};

const statusDot = {
  pending: "bg-gray-400",
  processing: "bg-amber-500",
  shipped: "bg-white",
  delivered: "bg-emerald-500",
  cancelled: "bg-red-500",
};

const API = process.env.NEXT_PUBLIC_API_URL;

export default function OrderPage({ params }) {
  const { id } = use(params);
  const { token, loading: authLoading } = useAuth();
  const { toast } = useToast();
  const { refreshCart } = useCart();
  const searchParams = useSearchParams();
  const paidParam = searchParams.get("paid");
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [pollExpired, setPollExpired] = useState(false);

  const loadOrder = useCallback(
    async ({ silent = false } = {}) => {
      if (!token) return;
      try {
        const res = await fetch(`${API}/orders/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to load order");
        setOrder(data);
      } catch (err) {
        if (!silent) setError(err.message);
      }
    },
    [token, id],
  );

  useEffect(() => {
    loadOrder();
  }, [loadOrder]);

  // Stripe's redirect can land before the webhook marks the order paid,
  // so keep checking for up to ~30 seconds.
  const hasOrder = !!order;
  const isPaid = !!order?.isPaid;
  useEffect(() => {
    if (paidParam !== "true" || !hasOrder || isPaid || pollExpired) return;
    let tries = 0;
    const timer = setInterval(() => {
      tries += 1;
      if (tries > 15) {
        clearInterval(timer);
        setPollExpired(true);
        return;
      }
      loadOrder({ silent: true });
    }, 2000);
    return () => clearInterval(timer);
  }, [paidParam, hasOrder, isPaid, pollExpired, loadOrder]);

  const showSuccess = paidParam === "true" && isPaid;
  useEffect(() => {
    if (showSuccess) refreshCart();
  }, [showSuccess]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`${API}/orders/${id}/cancel`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to cancel order");
      setOrder(data);
      toast({ message: "Order cancelled.", type: "success" });
    } catch (err) {
      toast({ message: err.message, type: "error" });
    } finally {
      setCancelling(false);
    }
  };

  if (!authLoading && !token) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center text-center">
            <h3 className="text-base font-medium text-gray-900 mb-1.5">
              Please log in
            </h3>
            <p className="text-sm text-gray-400 mb-5">
              Log in to view this order.
            </p>
            <Link
              href="/login"
              className="bg-gray-900 text-white rounded-xl px-5 py-2.5 text-sm font-medium hover:bg-gray-800 transition-all duration-150"
            >
              Log in
            </Link>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header />
        <main className="max-w-2xl mx-auto px-4 py-16">
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        </main>
      </>
    );
  }

  if (!order) {
    return (
      <>
        <Header />
        <OrderDetailSkeleton />
      </>
    );
  }

  // Trust the real DB state over the URL param.
  const showPending = paidParam === "true" && !order.isPaid;
  const showFailed = paidParam === "false";
  const shortId = order._id.slice(-6);
  const addr = order.shippingAddress;

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
        {showSuccess ? (
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-scale-in">
              <svg
                className="w-7 h-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-medium text-gray-900">Order placed</h1>
            <p className="text-sm text-gray-500 mt-1.5">
              Thanks for your purchase. Your order is being processed.
            </p>
            <p className="text-xs text-gray-400 mt-2">Order #{shortId}</p>
          </div>
        ) : (
          <>
            <h1 className="text-2xl font-medium text-gray-900 mb-1">
              Order #{shortId}
            </h1>
            <p className="text-gray-400 text-sm mb-6">
              Placed {new Date(order.createdAt).toLocaleDateString()}
            </p>

            {showPending && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
                {!pollExpired && (
                  <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin shrink-0" />
                )}
                {pollExpired
                  ? "Your payment is still being confirmed. Refresh in a minute, or check your orders."
                  : "Confirming your payment — this page will update shortly."}
              </div>
            )}
            {showFailed && (
              <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-6 text-sm">
                Payment wasn&apos;t completed.{" "}
                <Link href="/cart" className="font-medium underline">
                  Back to cart
                </Link>{" "}
                to try again.
              </div>
            )}
          </>
        )}

        <div className="border border-gray-200 rounded-2xl p-5 mb-4">
          <div className="flex flex-col divide-y divide-gray-100">
            {order.items.map((item) => (
              <div
                key={item._id}
                className="flex justify-between py-2.5 first:pt-0 last:pb-0 text-sm"
              >
                <span className="text-gray-700">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-gray-900">
                  ${(item.price * item.quantity).toFixed(2)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-medium text-gray-900">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        {addr?.address && (
          <div className="border border-gray-200 rounded-2xl p-5 mb-4 text-sm">
            <p className="font-medium text-gray-900 mb-1.5">Shipping to</p>
            <p className="text-gray-600">{addr.address}</p>
            <p className="text-gray-600">
              {addr.city}, {addr.postalCode}
            </p>
            <p className="text-gray-600">{addr.country}</p>
          </div>
        )}

        <div className="border border-gray-200 rounded-2xl p-5 text-sm flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full capitalize ${
              statusStyles[order.status] || statusStyles.pending
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[order.status] || statusDot.pending}`}
            />
            {order.status}
          </span>
        </div>
        <div className="border border-gray-200 rounded-2xl p-5 mt-3 text-sm flex items-center justify-between">
          <span className="text-gray-500">Paid</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full ${
              order.isPaid
                ? "bg-emerald-50 text-emerald-700"
                : "bg-gray-100 text-gray-500"
            }`}
          >
            {order.isPaid ? "Yes" : "No"}
          </span>
        </div>

        {showSuccess && (
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link
              href="/"
              className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium text-center transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
            >
              Continue shopping
            </Link>
            <Link
              href="/orders"
              className="border border-gray-200 text-gray-900 rounded-xl px-6 py-2.5 text-sm font-medium text-center transition-all duration-150 hover:border-gray-300 active:scale-[0.98]"
            >
              View all orders
            </Link>
          </div>
        )}

        {order.status === "pending" && !order.isPaid && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-6 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl px-5 py-2.5 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {cancelling && (
              <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
            )}
            {cancelling ? "Cancelling..." : "Cancel order"}
          </button>
        )}
      </main>
    </>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import Header from '@/components/Header';
import { OrderDetailSkeleton } from '@/components/Skeletons';

const statusStyles = {
  pending: 'bg-gray-100 text-gray-600',
  processing: 'bg-amber-50 text-amber-700',
  shipped: 'bg-gray-900 text-white',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-red-50 text-red-700',
};

const statusDot = {
  pending: 'bg-gray-400',
  processing: 'bg-amber-500',
  shipped: 'bg-white',
  delivered: 'bg-emerald-500',
  cancelled: 'bg-red-500',
};

export default function OrderPage({ params }) {
  const { id } = use(params);
  const { token } = useAuth();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const paidParam = searchParams.get('paid');
  const [order, setOrder] = useState(null);
  const [error, setError] = useState('');
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = () => {
    if (!token) return;
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to load order');
        setOrder(data);
      })
      .catch((err) => setError(err.message));
  };

  useEffect(() => {
    fetchOrder();
  }, [token, id]);

  const handleCancel = async () => {
    setCancelling(true);
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${id}/cancel`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to cancel order');
      setOrder(data);
      toast({ message: 'Order cancelled.', type: 'success' });
    } catch (err) {
      toast({ message: err.message, type: 'error' });
    } finally {
      setCancelling(false);
    }
  };

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

  // Trust the real DB state over the URL param: Stripe's redirect doesn't
  // guarantee the webhook has landed yet, so only show the success banner
  // once the order is actually marked paid.
  const showSuccessBanner = paidParam === 'true' && order.isPaid;
  const showPendingBanner = paidParam === 'true' && !order.isPaid;
  const showFailedBanner = paidParam === 'false';

  return (
    <>
      <Header />
      <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10 animate-fade-in-up">
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Order confirmed</h1>

        {showSuccessBanner && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl px-4 py-3 mb-6 text-sm">
            ✓ Payment successful. Your order is being processed.
          </div>
        )}
        {showPendingBanner && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-6 text-sm flex items-center gap-2">
            <span className="w-3.5 h-3.5 border-2 border-amber-300 border-t-amber-600 rounded-full animate-spin shrink-0" />
            Confirming your payment — this page will update shortly.
          </div>
        )}
        {showFailedBanner && (
          <div className="bg-amber-50 border border-amber-200 text-amber-700 rounded-xl px-4 py-3 mb-6 text-sm">
            Payment wasn't completed. You can try checking out again from your cart.
          </div>
        )}

        <p className="text-gray-400 text-sm mb-6">Order ID: {order._id}</p>

        <div className="border border-gray-200 rounded-2xl p-5 mb-6">
          <div className="flex flex-col divide-y divide-gray-100">
            {order.items.map((item) => (
              <div key={item._id} className="flex justify-between py-2.5 first:pt-0 last:pb-0 text-sm">
                <span className="text-gray-700">
                  {item.name} × {item.quantity}
                </span>
                <span className="text-gray-900">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 mt-3 pt-3 flex justify-between font-medium text-gray-900">
            <span>Total</span>
            <span>${order.totalPrice.toFixed(2)}</span>
          </div>
        </div>

        <div className="border border-gray-200 rounded-2xl p-5 text-sm flex items-center justify-between">
          <span className="text-gray-500">Status</span>
          <span
            className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full capitalize ${
              statusStyles[order.status] || statusStyles.pending
            }`}
          >
            <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${statusDot[order.status] || statusDot.pending}`} />
            {order.status}
          </span>
        </div>
        <div className="border border-gray-200 rounded-2xl p-5 mt-3 text-sm flex items-center justify-between">
          <span className="text-gray-500">Paid</span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full ${
              order.isPaid ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'
            }`}
          >
            {order.isPaid ? 'Yes' : 'No'}
          </span>
        </div>

        {order.status === 'pending' && (
          <button
            onClick={handleCancel}
            disabled={cancelling}
            className="mt-6 text-sm font-medium text-red-600 hover:text-red-700 border border-red-200 bg-red-50 hover:bg-red-100 rounded-xl px-5 py-2.5 transition-all duration-150 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {cancelling && (
              <span className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-600 rounded-full animate-spin" />
            )}
            {cancelling ? 'Cancelling...' : 'Cancel order'}
          </button>
        )}
      </main>
    </>
  );
}
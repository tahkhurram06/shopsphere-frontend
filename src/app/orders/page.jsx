'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import { OrdersSkeleton } from '@/components/Skeletons';

export default function OrdersPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/my`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to load orders');
          setOrders(data);
        })
        .catch((err) => setError(err.message));
    }
  }, [loading, user, token]);

  if (loading || (!orders && !error)) {
    return (
      <>
        <Header />
        <OrdersSkeleton />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Your orders</h1>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && orders?.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-medium text-gray-900 mb-1.5">No orders yet</h3>
            <p className="text-sm text-gray-400">Your past orders will show up here.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {orders?.map((order, i) => (
              <Link
                key={order._id}
                href={`/orders/${order._id}`}
                style={{ animationDelay: `${Math.min(i, 8) * 30}ms` }}
                className="animate-fade-in border border-gray-200 rounded-2xl p-4 flex justify-between items-center transition-all duration-200 hover:shadow-md hover:shadow-gray-900/[0.04]"
              >
                <div>
                  <p className="font-medium text-gray-900">Order #{order._id.slice(-6)}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(order.createdAt).toLocaleDateString()} · {order.items.length} item
                    {order.items.length !== 1 ? 's' : ''}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">${order.totalPrice.toFixed(2)}</p>
                  <span
                    className={`text-xs px-2.5 py-1 rounded-full capitalize inline-block mt-1 ${
                      order.status === 'delivered'
                        ? 'bg-emerald-50 text-emerald-700'
                        : order.status === 'cancelled'
                        ? 'bg-red-50 text-red-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}
                  >
                    {order.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
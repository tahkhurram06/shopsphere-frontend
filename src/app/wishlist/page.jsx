'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import Header from '@/components/Header';
import ProductImage from '@/components/ProductImage';

export default function WishlistPage() {
  const { user, token, loading } = useAuth();
  const router = useRouter();
  const [items, setItems] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
      return;
    }
    if (token) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/wishlist`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data.message || 'Failed to load wishlist');
          setItems(Array.isArray(data) ? data : []);
        })
        .catch((err) => setError(err.message));
    }
  }, [loading, user, token]);

  if (loading || (!items && !error)) {
    return (
      <>
        <Header />
        <main className="max-w-6xl mx-auto px-4 py-16 flex flex-col items-center justify-center gap-3 text-gray-400 text-sm">
          <span className="w-5 h-5 border-2 border-gray-200 border-t-gray-900 rounded-full animate-spin" />
          Loading...
        </main>
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl font-medium text-gray-900 mb-6">Your wishlist</h1>

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
            {error}
          </div>
        )}

        {!error && items?.length === 0 ? (
          <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-medium text-gray-900 mb-1.5">Your wishlist is empty</h3>
            <p className="text-sm text-gray-400">Tap the heart on any product to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {items?.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="group border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-900/[0.02] transition-all duration-300 hover:shadow-md hover:shadow-gray-900/[0.06] hover:-translate-y-0.5"
              >
                <div className="w-full h-48 overflow-hidden bg-gray-100">
                  <ProductImage
                    src={product.images?.[0]}
                    alt={product.name}
                    className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                </div>
                <div className="p-4">
                  <h2 className="font-medium text-gray-900 truncate">{product.name}</h2>
                  <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
                  <span className="font-medium text-gray-900">${product.price}</span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}
import Header from '@/components/Header';
import ProductImage from '@/components/ProductImage';
import ShopFilters from '@/components/ShopFilters';
import Link from 'next/link';

async function getProducts(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.keyword) params.set('keyword', searchParams.keyword);
  if (searchParams.category) params.set('category', searchParams.category);

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

// Separate, unfiltered fetch so the category dropdown always shows every
// category that exists, not just ones matching the current filter.
async function getAllCategories() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const all = await res.json();
  return [...new Set(all.map((p) => p.category).filter(Boolean))].sort();
}

function sortProducts(products, sort) {
  const sorted = [...products];
  switch (sort) {
    case 'price-asc':
      return sorted.sort((a, b) => a.price - b.price);
    case 'price-desc':
      return sorted.sort((a, b) => b.price - a.price);
    case 'rating-desc':
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return sorted; // backend already returns newest-first
  }
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  let products = [];
  let categories = [];
  let error = '';

  try {
    [products, categories] = await Promise.all([getProducts(params), getAllCategories()]);
    products = sortProducts(products, params.sort);
  } catch (err) {
    error = err.message;
  }

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <h1 className="text-2xl md:text-3xl font-medium text-gray-900 mb-1">Shop</h1>
        <p className="text-sm text-gray-400 mb-6">
          {error ? ' ' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
        </p>

        <ShopFilters categories={categories} />

        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-8">
            Couldn't load products right now. Please try again shortly.
          </div>
        )}

        {!error && products.length === 0 && (
          <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-medium text-gray-900 mb-1.5">No products found</h3>
            <p className="text-sm text-gray-400">Try a different search or filter.</p>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((product, i) => (
            <Link
              key={product._id}
              href={`/products/${product._id}`}
              style={{ animationDelay: `${Math.min(i, 8) * 40}ms` }}
              className="animate-fade-in-up group border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-900/[0.02] transition-all duration-300 hover:shadow-md hover:shadow-gray-900/[0.06] hover:-translate-y-0.5"
            >
              <div className="relative w-full h-48 overflow-hidden bg-gray-100">
                <ProductImage
                  src={product.images?.[0]}
                  alt={product.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
                {product.stock === 0 && (
                  <span className="absolute top-2.5 left-2.5 text-xs font-medium bg-gray-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">
                    Out of stock
                  </span>
                )}
                {product.discountPercentage > 0 && (
                  <span className="absolute top-2.5 right-2.5 text-xs font-medium bg-red-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">
                    -{product.discountPercentage}%
                  </span>
                )}
              </div>
              <div className="p-4">
                <h2 className="font-medium text-gray-900 truncate">{product.name}</h2>
                <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-900">${product.price}</span>
                  <span className="text-xs text-amber-600 flex items-center gap-0.5">
                    ★ {product.rating?.toFixed(1) || '0.0'}
                    <span className="text-gray-400">({product.numReviews || 0})</span>
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}
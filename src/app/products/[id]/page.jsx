import Header from '@/components/Header';
import AddToCartButton from '@/components/AddToCartButton';
import ProductGallery from '@/components/ProductGallery';
import ReviewForm from '@/components/ReviewForm';

async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: 'no-store',
  });
  if (!res.ok) return null;
  return res.json();
}

async function getReviews(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}/reviews`,
    { cache: 'no-store' }
  );
  if (!res.ok) return [];
  return res.json();
}

export default async function ProductDetailPage({ params }) {
  const { id } = await params;
  const product = await getProduct(id);
  const reviews = product ? await getReviews(id) : [];

  if (!product) {
    return (
      <>
        <Header />
        <main className="max-w-4xl mx-auto px-4 py-16">
          <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
            <h3 className="text-base font-medium text-gray-900 mb-1.5">Product not found</h3>
            <p className="text-sm text-gray-400">This item may have been removed.</p>
          </div>
        </main>
      </>
    );
  }

  const discounted = product.discountPercentage > 0;
  const finalPrice = discounted
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;

  return (
    <>
      <Header />
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <ProductGallery
            images={product.images}
            alt={product.name}
            discountBadge={
              discounted && (
                <span className="absolute top-3 right-3 text-xs font-medium bg-red-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">
                  -{product.discountPercentage}%
                </span>
              )
            }
          />

          <div className="flex flex-col">
            <h1 className="text-2xl font-medium text-gray-900 mb-1">{product.name}</h1>
            <p className="text-sm text-gray-400 mb-3">{product.brand}</p>
            <p className="text-sm text-amber-600 mb-4 flex items-center gap-1">
              ★ {product.rating?.toFixed(1) || '0.0'}
              <span className="text-gray-400">({product.numReviews || 0} reviews)</span>
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">{product.description}</p>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-medium text-gray-900">${finalPrice}</span>
              {discounted && (
                <span className="text-sm text-gray-400 line-through">${product.price}</span>
              )}
            </div>

            <p
              className={`text-xs mb-6 ${
                product.stock > 0 ? 'text-gray-400' : 'text-red-500 font-medium'
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : 'Out of stock'}
            </p>

            <AddToCartButton productId={product._id} stock={product.stock} />
          </div>
        </div>

        <section>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Reviews</h2>

          <div className="flex flex-col gap-3 mb-6">
            {reviews.length === 0 ? (
              <p className="text-sm text-gray-400">No reviews yet. Be the first to leave one.</p>
            ) : (
              reviews.map((review) => (
                <div key={review._id} className="border border-gray-200 rounded-2xl p-4">
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-900">{review.user?.name}</span>
                    <span className="text-amber-500 text-sm">★ {review.rating}</span>
                  </div>
                  <p className="text-sm text-gray-600">{review.comment}</p>
                </div>
              ))
            )}
          </div>

          <ReviewForm productId={product._id} />
        </section>
      </main>
    </>
  );
}
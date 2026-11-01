import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

async function getRelated(category, excludeId) {
  const params = new URLSearchParams({ category });
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  const all = await res.json();
  return all.filter((p) => p._id !== excludeId).slice(0, 4);
}

export default async function RelatedProducts({ category, excludeId }) {
  const related = await getRelated(category, excludeId);
  if (related.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-lg font-medium text-gray-900 mb-4">You might also like</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
        {related.map((product) => (
          <Link
            key={product._id}
            href={`/products/${product._id}`}
            className="group border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-900/[0.02] transition-all duration-300 hover:shadow-md hover:shadow-gray-900/[0.06] hover:-translate-y-0.5"
          >
            <div className="w-full h-36 overflow-hidden bg-gray-100">
              <ProductImage
                src={product.images?.[0]}
                alt={product.name}
                className="w-full h-36 object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium text-gray-900 truncate">{product.name}</h3>
              <p className="text-sm text-gray-900 mt-0.5">${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
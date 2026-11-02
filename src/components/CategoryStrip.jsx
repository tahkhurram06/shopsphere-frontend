import Link from 'next/link';
import ProductImage from '@/components/ProductImage';

// categories: [{ name, image, count }]
export default function CategoryStrip({ categories }) {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="mt-14">
      <h2 className="text-lg md:text-xl font-medium text-gray-900 mb-5">Shop by category</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {categories.slice(0, 6).map((cat) => (
          <Link
            key={cat.name}
            href={`/?category=${encodeURIComponent(cat.name)}#products`}
            className="group"
          >
            <div className="rounded-2xl overflow-hidden border border-gray-200 bg-gray-100 transition-all duration-300 group-hover:shadow-md group-hover:shadow-gray-900/[0.06] group-hover:-translate-y-0.5">
              <ProductImage
                src={cat.image}
                alt={cat.name}
                className="w-full aspect-square object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <p className="text-sm font-medium text-gray-900 mt-2.5 truncate capitalize">
              {cat.name}
            </p>
            <p className="text-xs text-gray-400">
              {cat.count} product{cat.count !== 1 ? 's' : ''}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
}
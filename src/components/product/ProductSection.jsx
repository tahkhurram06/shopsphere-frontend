import Link from "next/link";
import ProductCard from "@/components/product/ProductCard";

export default function ProductSection({ id, title, products, href }) {
  if (!products || products.length === 0) return null;

  return (
    <section id={id} className="mt-14 scroll-mt-24">
      <div className="flex items-end justify-between mb-5">
        <h2 className="text-lg md:text-xl font-medium text-gray-900">
          {title}
        </h2>
        {href && (
          <Link
            href={href}
            className="text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150"
          >
            View all
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </section>
  );
}

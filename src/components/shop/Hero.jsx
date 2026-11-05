import Link from "next/link";
import ProductImage from "@/components/product/ProductImage";

export default function Hero({ featured, hasDeals }) {
  const discounted = featured?.discountPercentage > 0;
  const price = featured
    ? discounted
      ? (featured.price * (1 - featured.discountPercentage / 100)).toFixed(2)
      : featured.price
    : null;

  return (
    <section className="rounded-3xl border border-gray-200 bg-gray-50 px-6 py-10 sm:px-10 md:py-14 grid md:grid-cols-2 items-center gap-8 md:gap-12">
      <div>
        <h1 className="text-3xl md:text-5xl font-medium text-gray-900 tracking-tight leading-[1.1]">
          Shop what&apos;s new and what&apos;s worth it.
        </h1>
        <p className="text-sm md:text-base text-gray-500 mt-4 max-w-md leading-relaxed">
          Browse new arrivals, top-rated picks and current deals in one place.
        </p>
        <div className="flex flex-wrap gap-3 mt-7">
          <Link
            href="#products"
            className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 hover:shadow-lg hover:shadow-gray-900/20 active:scale-[0.98]"
          >
            Shop all products
          </Link>
          {hasDeals && (
            <Link
              href="#on-sale"
              className="bg-white text-gray-900 border border-gray-200 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:border-gray-300 active:scale-[0.98]"
            >
              See deals
            </Link>
          )}
        </div>
      </div>

      {featured && (
        <Link
          href={`/products/${featured._id}`}
          className="group relative block rounded-2xl overflow-hidden border border-gray-200 bg-gray-100"
        >
          <ProductImage
            src={featured.images?.[0]}
            alt={featured.name}
            className="w-full h-64 md:h-80 object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {discounted && (
            <span className="absolute top-3 right-3 text-xs font-medium bg-red-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">
              -{featured.discountPercentage}%
            </span>
          )}
          <div className="absolute left-3 right-3 bottom-3 bg-white/90 backdrop-blur rounded-xl px-4 py-3 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {featured.name}
              </p>
              <p className="text-xs text-gray-400 truncate">{featured.brand}</p>
            </div>
            <span className="flex items-baseline gap-1.5 shrink-0">
              <span className="text-sm font-medium text-gray-900">
                ${price}
              </span>
              {discounted && (
                <span className="text-xs text-gray-400 line-through">
                  ${featured.price}
                </span>
              )}
            </span>
          </div>
        </Link>
      )}
    </section>
  );
}

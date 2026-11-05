import Link from "next/link";
import ProductImage from "@/components/product/ProductImage";
import WishlistButton from "@/components/product/WishlistButton";
import QuickAddButton from "@/components/product/Quickaddbutton";

// Pass `index` only where you want the staggered fade-in (e.g. the main grid).
export default function ProductCard({ product, index }) {
  const discounted = product.discountPercentage > 0;
  const outOfStock = product.stock === 0;
  const finalPrice = discounted
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;
  const href = `/products/${product._id}`;

  return (
    <div
      style={
        index !== undefined
          ? { animationDelay: `${Math.min(index, 8) * 40}ms` }
          : undefined
      }
      className={`${
        index !== undefined ? "animate-fade-in-up " : ""
      }group border border-gray-200 rounded-2xl overflow-hidden bg-white shadow-sm shadow-gray-900/[0.02] transition-all duration-300 hover:shadow-md hover:shadow-gray-900/[0.06] hover:-translate-y-0.5`}
    >
      <div className="relative w-full h-48 overflow-hidden bg-gray-100">
        <Link href={href} tabIndex={-1} aria-hidden="true" className="block">
          <ProductImage
            src={product.images?.[0]}
            alt={product.name}
            className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
          />
        </Link>

        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5 pointer-events-none">
          {discounted && (
            <span className="text-xs font-medium bg-red-600/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">
              -{product.discountPercentage}%
            </span>
          )}
          {outOfStock && (
            <span className="text-xs font-medium bg-gray-900/90 backdrop-blur-sm text-white px-2.5 py-1 rounded-full shadow-sm">
              Out of stock
            </span>
          )}
        </div>

        <WishlistButton
          productId={product._id}
          variant="card"
          className="absolute top-2.5 right-2.5"
        />

        {!outOfStock && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 transition-all duration-200 sm:opacity-0 sm:translate-y-1 sm:group-hover:opacity-100 sm:group-hover:translate-y-0 sm:group-focus-within:opacity-100 sm:group-focus-within:translate-y-0">
            <QuickAddButton productId={product._id} />
          </div>
        )}
      </div>

      <Link href={href} className="block p-4">
        <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
        <p className="text-xs text-gray-400 mb-2">{product.brand}</p>
        <div className="flex items-center justify-between">
          <span className="flex items-baseline gap-1.5">
            <span className="font-medium text-gray-900">${finalPrice}</span>
            {discounted && (
              <span className="text-xs text-gray-400 line-through">
                ${product.price}
              </span>
            )}
          </span>
          <span className="text-xs text-amber-600 flex items-center gap-0.5">
            ★ {product.rating?.toFixed(1) || "0.0"}
            <span className="text-gray-400">({product.numReviews || 0})</span>
          </span>
        </div>
      </Link>
    </div>
  );
}

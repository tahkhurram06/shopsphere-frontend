import Header from "@/components/layout/Header";
import ProductGallery from "@/components/product/ProductGallery";
import ReviewForm from "@/components/product/ReviewForm";
import ReviewsSection from "@/components/product/Reviewssection";
import Breadcrumbs from "@/components/common/Breadcrumbs";
import WishlistButton from "@/components/product/WishlistButton";
import RelatedProducts from "@/components/product/RelatedProducts";
import RecentlyViewed from "@/components/product/Recentlyviewed";
import BuyBox from "@/components/product/Buybox";
import TrustRow from "@/components/product/Trustrow";

async function getProduct(id) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) return null;
  return res.json();
}

async function getReviews(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products/${id}/reviews`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  return res.json();
}

// Shared SEO: shows product name, description, price, and image on social
// shares / search results. generateMetadata runs server-side, same fetch
// as the page itself (Next.js dedupes identical fetches in one render).
export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await getProduct(id);

  if (!product) {
    return {
      title: "Product not found",
      description: "This item may have been removed.",
    };
  }

  const discounted = product.discountPercentage > 0;
  const finalPrice = discounted
    ? (product.price * (1 - product.discountPercentage / 100)).toFixed(2)
    : product.price;
  const image = product.images?.[0];
  const description =
    product.description?.slice(0, 160) ||
    `${product.name} — $${finalPrice} at ShopSphere.`;

  return {
    title: product.name,
    description,
    openGraph: {
      title: product.name,
      description,
      images: image ? [{ url: image, alt: product.name }] : [],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: image ? [image] : [],
    },
  };
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
            <h3 className="text-base font-medium text-gray-900 mb-1.5">
              Product not found
            </h3>
            <p className="text-sm text-gray-400">
              This item may have been removed.
            </p>
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
      {/* extra bottom padding on mobile so the sticky bar never covers content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10 pb-44 md:pb-10">
        <Breadcrumbs
          items={[
            { label: "Shop", href: "/" },
            {
              label: product.category,
              href: `/?category=${encodeURIComponent(product.category)}`,
            },
            { label: product.name },
          ]}
        />

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
            <div className="flex items-start justify-between gap-3 mb-1">
              <h1 className="text-2xl font-medium text-gray-900">
                {product.name}
              </h1>
              <WishlistButton productId={product._id} className="shrink-0" />
            </div>
            <p className="text-sm text-gray-400 mb-3">{product.brand}</p>
            <p className="text-sm text-amber-600 mb-4 flex items-center gap-1">
              ★ {product.rating?.toFixed(1) || "0.0"}
              <span className="text-gray-400">
                ({product.numReviews || 0} reviews)
              </span>
            </p>
            <p className="text-sm text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            <div className="flex items-baseline gap-2 mb-2">
              <span className="text-2xl font-medium text-gray-900">
                ${finalPrice}
              </span>
              {discounted && (
                <span className="text-sm text-gray-400 line-through">
                  ${product.price}
                </span>
              )}
            </div>

            <p
              className={`text-xs mb-6 ${
                product.stock > 0 ? "text-gray-400" : "text-red-500 font-medium"
              }`}
            >
              {product.stock > 0 ? `${product.stock} in stock` : "Out of stock"}
            </p>

            <BuyBox
              productId={product._id}
              stock={product.stock}
              name={product.name}
              price={finalPrice}
            />

            <TrustRow />
          </div>
        </div>

        <section>
          <ReviewsSection reviews={reviews} rating={product.rating} />
          <ReviewForm productId={product._id} />
        </section>

        <RelatedProducts category={product.category} excludeId={product._id} />

        <RecentlyViewed
          product={{
            _id: product._id,
            name: product.name,
            brand: product.brand,
            price: product.price,
            discountPercentage: product.discountPercentage || 0,
            image: product.images?.[0] || null,
          }}
        />
      </main>
    </>
  );
}

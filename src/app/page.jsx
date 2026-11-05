import Header from "@/components/layout/Header";
import Hero from "@/components/shop/Hero";
import CategoryStrip from "@/components/shop/CategoryStrip";
import ProductSection from "@/components/product/ProductSection";
import ProductCard from "@/components/product/ProductCard";
import ShopFilters from "@/components/shop/ShopFilters";
import Pagination from "@/components/shop/Pagination";
import Footer from "@/components/layout/Footer";

const PAGE_SIZE = 12;
const BROWSE_KEYS = [
  "keyword",
  "category",
  "sort",
  "minPrice",
  "maxPrice",
  "rating",
  "inStock",
  "page",
];

async function getProducts(searchParams) {
  const params = new URLSearchParams();
  if (searchParams.keyword) params.set("keyword", searchParams.keyword);
  if (searchParams.category) params.set("category", searchParams.category);

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/products?${params.toString()}`,
    {
      cache: "no-store",
    },
  );
  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// Unfiltered fetch so the category dropdown always lists every category.
async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: "no-store",
  });
  if (!res.ok) return [];
  return res.json();
}

// Price a customer actually sees (after discount)
function finalPrice(p) {
  return p.discountPercentage > 0
    ? p.price * (1 - p.discountPercentage / 100)
    : p.price;
}

// The backend only filters by keyword + category, so the rest is applied here.
function applyFilters(products, params) {
  const min = parseFloat(params.minPrice);
  const max = parseFloat(params.maxPrice);
  const rating = parseFloat(params.rating);
  return products.filter((p) => {
    const price = finalPrice(p);
    if (!isNaN(min) && price < min) return false;
    if (!isNaN(max) && price > max) return false;
    if (!isNaN(rating) && (p.rating || 0) < rating) return false;
    if (params.inStock === "1" && !(p.stock > 0)) return false;
    return true;
  });
}

function sortProducts(products, sort) {
  const sorted = [...products];
  switch (sort) {
    case "price-asc":
      return sorted.sort((a, b) => finalPrice(a) - finalPrice(b));
    case "price-desc":
      return sorted.sort((a, b) => finalPrice(b) - finalPrice(a));
    case "rating-desc":
      return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
    default:
      return sorted; // backend already returns newest-first
  }
}

function buildCategoryCards(all) {
  const map = new Map();
  for (const p of all) {
    if (!p.category) continue;
    const entry = map.get(p.category) || {
      name: p.category,
      image: null,
      count: 0,
    };
    entry.count += 1;
    if (!entry.image && p.images?.[0]) entry.image = p.images[0];
    map.set(p.category, entry);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  // Any filter, sort or page = plain browsing view (no hero or curated sections).
  const browsing = BROWSE_KEYS.some((k) => params[k]);

  let products = [];
  let all = [];
  let error = "";

  try {
    if (browsing) {
      [products, all] = await Promise.all([
        getProducts(params),
        getAllProducts(),
      ]);
      products = sortProducts(applyFilters(products, params), params.sort);
    } else {
      all = await getAllProducts();
      products = all;
    }
  } catch (err) {
    error = err.message;
  }

  const categoryCards = buildCategoryCards(all);
  const categories = categoryCards.map((c) => c.name);

  // Pagination
  const total = products.length;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
  const page = Math.min(
    Math.max(parseInt(params.page, 10) || 1, 1),
    totalPages,
  );
  const start = (page - 1) * PAGE_SIZE;
  const pageItems = products.slice(start, start + PAGE_SIZE);

  const countText = error
    ? " "
    : total <= PAGE_SIZE
      ? `${total} product${total !== 1 ? "s" : ""}`
      : `Showing ${start + 1}–${start + pageItems.length} of ${total} products`;

  // Curated sections (default view only)
  const newArrivals = all.slice(0, 4);
  const topRated = [...all]
    .filter((p) => (p.rating || 0) > 0)
    .sort((a, b) => b.rating - a.rating)
    .slice(0, 4);
  const onSale = all
    .filter((p) => p.discountPercentage > 0)
    .sort((a, b) => b.discountPercentage - a.discountPercentage)
    .slice(0, 4);
  const featured = onSale[0] || all[0];

  return (
    <>
      <Header />
      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {!browsing && !error && all.length > 0 && (
          <>
            <Hero featured={featured} hasDeals={onSale.length > 0} />
            <CategoryStrip categories={categoryCards} />
            <ProductSection
              id="new-arrivals"
              title="New arrivals"
              products={newArrivals}
            />
            <ProductSection
              id="top-rated"
              title="Top rated"
              products={topRated}
              href="/?sort=rating-desc#products"
            />
            <ProductSection id="on-sale" title="On sale" products={onSale} />
          </>
        )}

        <section
          id="products"
          className={`scroll-mt-24 ${browsing ? "" : "mt-16"}`}
        >
          <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-1">
            {browsing ? "Shop" : "All products"}
          </h2>
          <p className="text-sm text-gray-400 mb-6">{countText}</p>

          <ShopFilters categories={categories} />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-8">
              Couldn&apos;t load products right now. Please try again shortly.
            </div>
          )}

          {!error && total === 0 && (
            <div className="border border-gray-200 rounded-2xl p-12 flex flex-col items-center justify-center text-center">
              <h3 className="text-base font-medium text-gray-900 mb-1.5">
                No products found
              </h3>
              <p className="text-sm text-gray-400">
                Try removing a filter or searching for something else.
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
            {pageItems.map((product, i) => (
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>

          <Pagination page={page} totalPages={totalPages} params={params} />
        </section>
      </main>
      <Footer />
    </>
  );
}

import Header from '@/components/Header';
import Hero from '@/components/Hero';
import CategoryStrip from '@/components/CategoryStrip';
import ProductSection from '@/components/ProductSection';
import ProductCard from '@/components/ProductCard';
import ShopFilters from '@/components/ShopFilters';
import Footer from '@/components/Footer';

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

// Unfiltered fetch so the category dropdown always lists every category.
async function getAllProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`, {
    cache: 'no-store',
  });
  if (!res.ok) return [];
  return res.json();
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

function buildCategoryCards(all) {
  const map = new Map();
  for (const p of all) {
    if (!p.category) continue;
    const entry = map.get(p.category) || { name: p.category, image: null, count: 0 };
    entry.count += 1;
    if (!entry.image && p.images?.[0]) entry.image = p.images[0];
    map.set(p.category, entry);
  }
  return [...map.values()].sort((a, b) => a.name.localeCompare(b.name));
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  // Any active filter/sort = plain browsing view (no hero or curated sections).
  const browsing = Boolean(params.keyword || params.category || params.sort);

  let products = [];
  let all = [];
  let error = '';

  try {
    if (browsing) {
      [products, all] = await Promise.all([getProducts(params), getAllProducts()]);
      products = sortProducts(products, params.sort);
    } else {
      all = await getAllProducts();
      products = all;
    }
  } catch (err) {
    error = err.message;
  }

  const categoryCards = buildCategoryCards(all);
  const categories = categoryCards.map((c) => c.name);

  // Curated sections (only used on the default view)
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
            <ProductSection id="new-arrivals" title="New arrivals" products={newArrivals} />
            <ProductSection
              id="top-rated"
              title="Top rated"
              products={topRated}
              href="/?sort=rating-desc#products"
            />
            <ProductSection id="on-sale" title="On sale" products={onSale} />
          </>
        )}

        <section id="products" className={`scroll-mt-24 ${browsing ? '' : 'mt-16'}`}>
          <h2 className="text-2xl md:text-3xl font-medium text-gray-900 mb-1">
            {browsing ? 'Shop' : 'All products'}
          </h2>
          <p className="text-sm text-gray-400 mb-6">
            {error ? ' ' : `${products.length} product${products.length !== 1 ? 's' : ''}`}
          </p>

          <ShopFilters categories={categories} />

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 mb-8">
              Couldn&apos;t load products right now. Please try again shortly.
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
              <ProductCard key={product._id} product={product} index={i} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
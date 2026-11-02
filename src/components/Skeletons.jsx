// Uses the .skeleton class from globals.css (dark mode included).

export function Skeleton({ className = '' }) {
  return <div className={`skeleton rounded-xl ${className}`} />;
}

export function ProductCardSkeleton() {
  return (
    <div className="border border-gray-200 rounded-2xl overflow-hidden bg-white">
      <Skeleton className="w-full h-48 rounded-none" />
      <div className="p-4 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <div className="flex justify-between pt-1">
          <Skeleton className="h-4 w-14" />
          <Skeleton className="h-3 w-12" />
        </div>
      </div>
    </div>
  );
}

export function ProductGridSkeleton({ count = 8 }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
      {Array.from({ length: count }).map((_, i) => (
        <ProductCardSkeleton key={i} />
      ))}
    </div>
  );
}

export function HomeSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="w-full h-72 md:h-96 rounded-3xl mb-14" />
      <Skeleton className="h-6 w-40 mb-5" />
      <ProductGridSkeleton count={8} />
    </main>
  );
}

export function ProductDetailSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="h-3 w-48 mb-6" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <Skeleton className="w-full h-80 md:h-96 rounded-2xl" />
        <div className="flex flex-col gap-3">
          <Skeleton className="h-7 w-3/4" />
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-16 w-full mt-2" />
          <Skeleton className="h-8 w-28 mt-4" />
          <Skeleton className="h-11 w-56 mt-4" />
        </div>
      </div>
      <Skeleton className="h-5 w-24 mb-4" />
      <Skeleton className="h-20 w-full mb-3 rounded-2xl" />
      <Skeleton className="h-20 w-full rounded-2xl" />
    </main>
  );
}

export function CartSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2].map((i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-4 flex items-center gap-4">
            <Skeleton className="w-20 h-20 shrink-0" />
            <div className="flex-1 flex flex-col gap-2">
              <Skeleton className="h-4 w-1/2" />
              <Skeleton className="h-3 w-1/4" />
            </div>
            <Skeleton className="h-9 w-24 shrink-0" />
          </div>
        ))}
      </div>
    </main>
  );
}

export function OrdersSkeleton() {
  return (
    <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="h-8 w-40 mb-6" />
      <div className="flex flex-col gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="border border-gray-200 rounded-2xl p-4 flex justify-between items-center">
            <div className="flex flex-col gap-2">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-3 w-44" />
            </div>
            <div className="flex flex-col items-end gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-5 w-20 rounded-full" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}

export function OrderDetailSkeleton() {
  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="h-8 w-48 mb-3" />
      <Skeleton className="h-3 w-64 mb-6" />
      <Skeleton className="h-40 w-full mb-6 rounded-2xl" />
      <Skeleton className="h-16 w-full mb-3 rounded-2xl" />
      <Skeleton className="h-16 w-full rounded-2xl" />
    </main>
  );
}

export function WishlistSkeleton() {
  return (
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="h-8 w-44 mb-6" />
      <ProductGridSkeleton count={4} />
    </main>
  );
}

export function AccountSkeleton() {
  return (
    <main className="max-w-xl mx-auto px-4 sm:px-6 py-10">
      <Skeleton className="h-8 w-32 mb-6" />
      <Skeleton className="h-64 w-full mb-6 rounded-2xl" />
      <Skeleton className="h-80 w-full rounded-2xl" />
    </main>
  );
}
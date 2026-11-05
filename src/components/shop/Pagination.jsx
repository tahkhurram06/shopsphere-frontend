import Link from 'next/link';

const base =
  'min-w-9 h-9 px-3 flex items-center justify-center rounded-xl border text-sm transition-colors duration-150';

export default function Pagination({ page, totalPages, params }) {
  if (totalPages <= 1) return null;

  const hrefFor = (p) => {
    const qs = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (k !== 'page' && v && typeof v === 'string') qs.set(k, v);
    });
    if (p > 1) qs.set('page', String(p));
    const s = qs.toString();
    return `/${s ? `?${s}` : ''}#products`;
  };

  // 1 … prev current next … last
  const nums = [...new Set([1, totalPages, page - 1, page, page + 1])]
    .filter((n) => n >= 1 && n <= totalPages)
    .sort((a, b) => a - b);

  const items = [];
  nums.forEach((n, i) => {
    if (i > 0 && n - nums[i - 1] > 1) items.push('gap-' + n);
    items.push(n);
  });

  return (
    <nav aria-label="Pagination" className="mt-10 flex items-center justify-center gap-1.5 flex-wrap">
      <Link
        href={hrefFor(page - 1)}
        aria-disabled={page === 1}
        className={`${base} border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 ${
          page === 1 ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        ← Prev
      </Link>

      {items.map((item) =>
        typeof item === 'string' ? (
          <span key={item} className="px-1 text-gray-400">…</span>
        ) : (
          <Link
            key={item}
            href={hrefFor(item)}
            aria-current={item === page ? 'page' : undefined}
            className={`${base} ${
              item === page
                ? 'bg-gray-900 text-white border-gray-900'
                : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900'
            }`}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={hrefFor(page + 1)}
        aria-disabled={page === totalPages}
        className={`${base} border-gray-200 text-gray-600 hover:border-gray-300 hover:text-gray-900 ${
          page === totalPages ? 'opacity-40 pointer-events-none' : ''
        }`}
      >
        Next →
      </Link>
    </nav>
  );
}
import { money } from '@/lib/checkout';

export default function FreeShippingBar({ merchandise, threshold }) {
  const remaining = Math.max(0, threshold - merchandise);
  const pct = Math.min(100, (merchandise / threshold) * 100);

  return (
    <div className="border border-gray-200 rounded-2xl px-5 py-4 mb-4">
      <p className="text-sm text-gray-600 mb-2.5">
        {remaining > 0 ? (
          <>
            Add <span className="font-medium text-gray-900">{money(remaining)}</span> more for free
            shipping
          </>
        ) : (
          <span className="font-medium text-gray-900">✓ You&apos;ve unlocked free shipping</span>
        )}
      </p>
      <div className="h-1.5 rounded-full bg-gray-100 overflow-hidden">
        <div
          className="h-full rounded-full bg-gray-900 transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
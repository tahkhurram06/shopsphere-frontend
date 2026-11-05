import { money } from '@/lib/checkout';

function Row({ label, value, valueClass = 'text-gray-900' }) {
  return (
    <div className="flex justify-between text-sm">
      <dt className="text-gray-500">{label}</dt>
      <dd className={valueClass}>{value}</dd>
    </div>
  );
}

// Sticky on desktop. `children` is the call-to-action button for the current step.
export default function OrderSummary({ totals, children }) {
  return (
    <aside className="lg:sticky lg:top-24 border border-gray-200 rounded-2xl p-5">
      <h2 className="text-sm font-medium text-gray-900 mb-4">Order summary</h2>

      <dl className="flex flex-col gap-2.5">
        <Row
          label={`Subtotal (${totals.qty} item${totals.qty !== 1 ? 's' : ''})`}
          value={money(totals.listSubtotal)}
        />
        {totals.discount > 0 && (
          <Row
            label="Discount"
            value={`−${money(totals.discount)}`}
            valueClass="text-emerald-600"
          />
        )}
        <Row label="Shipping" value={totals.shipping === 0 ? 'Free' : money(totals.shipping)} />
      </dl>

      <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-baseline">
        <span className="font-medium text-gray-900">Total</span>
        <span className="text-xl font-medium text-gray-900">{money(totals.total)}</span>
      </div>

      {children && <div className="mt-5 flex flex-col gap-3">{children}</div>}
    </aside>
  );
}
// Edit the wording to match your real policies.
const ITEMS = [
  {
    title: 'Free returns',
    text: 'Hassle-free on eligible orders',
    icon: 'M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99',
  },
  {
    title: 'Secure payment',
    text: 'Encrypted checkout via Stripe',
    icon: 'M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z',
  },
  {
    title: 'Fast delivery',
    text: 'Orders ship quickly',
    icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z',
  },
];

export default function TrustRow() {
  return (
    <ul className="flex flex-col divide-y divide-gray-100 mt-6 pt-5 border-t border-gray-100">
      {ITEMS.map((item) => (
        <li key={item.title} className="flex items-center gap-3 py-2.5 first:pt-0 last:pb-0">
          <span className="shrink-0 w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center">
            <svg
              className="w-[17px] h-[17px] text-gray-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.8}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
            </svg>
          </span>
          <p className="text-sm text-gray-700 min-w-0">
            <span className="font-medium text-gray-900">{item.title}</span>
            <span className="text-gray-400"> — {item.text}</span>
          </p>
        </li>
      ))}
    </ul>
  );
}
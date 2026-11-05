const STEPS = ['Address', 'Review', 'Pay'];

// current: 0 = Address, 1 = Review, 2 = Pay
export default function CheckoutSteps({ current }) {
  return (
    <ol className="flex items-center mb-8" aria-label="Checkout progress">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <li key={label} className={`flex items-center ${i < STEPS.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center gap-2.5">
              <span
                aria-current={active ? 'step' : undefined}
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-medium transition-colors duration-200 ${
                  done || active
                    ? 'bg-gray-900 text-white'
                    : 'border border-gray-200 text-gray-400'
                } ${active ? 'ring-4 ring-gray-900/10' : ''}`}
              >
                {done ? '✓' : i + 1}
              </span>
              <span
                className={` hidden xs:inline text-sm ${
                  done || active ? 'text-gray-900 font-medium' : 'text-gray-400'
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <span className="flex-1 mx-3 sm:mx-4 h-px bg-gray-100 relative overflow-hidden">
                <span
                  className="absolute inset-y-0 left-0 bg-gray-900 transition-all duration-300"
                  style={{ width: done ? '100%' : '0%' }}
                />
              </span>
            )}
          </li>
        );
      })}
    </ol>
  );
}
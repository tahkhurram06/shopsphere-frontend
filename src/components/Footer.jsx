import Link from 'next/link';
import NewsletterForm from '@/components/NewsletterForm';

const linkClass = 'text-sm text-gray-500 hover:text-gray-900 transition-colors duration-150';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gray-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1">
          <Link href="/" className="flex items-center gap-2.5 mb-3">
            <div className="w-8 h-8 rounded-lg bg-gray-900 flex items-center justify-center">
              <span className="text-white text-sm font-medium">S</span>
            </div>
            <span className="font-medium text-gray-900">ShopSphere</span>
          </Link>
          {/* Edit this contact email */}
          <p className="text-sm text-gray-500 leading-relaxed">
            Questions about an order?
            <br />
            support@shopsphere.com
          </p>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Shop</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="/" className={linkClass}>All products</Link></li>
            <li><Link href="/wishlist" className={linkClass}>Wishlist</Link></li>
            <li><Link href="/cart" className={linkClass}>Cart</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-medium text-gray-900 mb-3">Account</h3>
          <ul className="flex flex-col gap-2">
            <li><Link href="/account" className={linkClass}>Your account</Link></li>
            <li><Link href="/orders" className={linkClass}>Your orders</Link></li>
          </ul>
        </div>

        <div className="col-span-2 md:col-span-1">
          <h3 className="text-sm font-medium text-gray-900 mb-1">Get updates</h3>
          <p className="text-sm text-gray-500 mb-3">New arrivals and deals, no spam.</p>
          <NewsletterForm />
        </div>
      </div>

      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} ShopSphere. All rights reserved.
          </p>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400 mr-1">Secure payments by Stripe</span>
            {/* Edit to match the cards you accept */}
            {['Visa', 'Mastercard', 'Amex'].map((brand) => (
              <span
                key={brand}
                className="text-[11px] font-medium text-gray-500 border border-gray-200 rounded-md px-2 py-1"
              >
                {brand}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
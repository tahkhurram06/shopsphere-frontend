import Link from "next/link";
import Header from "@/components/layout/Header";

export default function NotFound() {
  return (
    <>
      <Header />
      <main className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="text-center max-w-sm animate-fade-in-up">
          <p className="text-6xl font-medium text-gray-900 mb-2">404</p>
          <h1 className="text-xl font-medium text-gray-900 mb-2">
            Page not found
          </h1>
          <p className="text-sm text-gray-400 mb-7 leading-relaxed">
            The page you&apos;re looking for doesn&apos;t exist or may have been
            moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/"
              className="bg-gray-900 text-white rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:bg-gray-800 active:scale-[0.98]"
            >
              Back to shop
            </Link>
            <Link
              href="/wishlist"
              className="border border-gray-200 text-gray-900 rounded-xl px-6 py-2.5 text-sm font-medium transition-all duration-150 hover:border-gray-300 active:scale-[0.98]"
            >
              View wishlist
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

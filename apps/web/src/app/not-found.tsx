import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="text-center max-w-md bg-white p-8 rounded-2xl shadow-md">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
          <span className="text-2xl">🔍</span>
        </div>

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Page not found
        </h2>

        <p className="text-gray-600 mb-6">
          The page you’re looking for doesn’t exist or may have been moved.
        </p>

        <Link
          href="/"
          className="inline-block rounded-xl bg-primary px-6 py-3 text-white font-semibold hover:bg-primary/80 transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}

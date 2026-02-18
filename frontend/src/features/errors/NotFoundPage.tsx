import { Link } from 'react-router-dom';
import { FileQuestion, ArrowLeft, Home } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-6">
      <div className="max-w-md text-center">
        <FileQuestion className="mx-auto h-20 w-20 text-navy-300" />
        <h1 className="mt-6 text-6xl font-extrabold text-navy-950">404</h1>
        <h2 className="mt-2 text-xl font-semibold text-navy-700">Page Not Found</h2>
        <p className="mt-3 text-navy-600">
          The page you are looking for does not exist or has been moved.
          Please check the URL or navigate back.
        </p>
        <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-lg bg-navy-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-navy-800 transition-colors"
          >
            <Home className="h-4 w-4" /> Go Home
          </Link>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="inline-flex items-center gap-2 rounded-lg border border-navy-200 px-5 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-100 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

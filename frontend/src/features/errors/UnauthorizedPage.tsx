import { Link } from 'react-router-dom';
import { ShieldX, ArrowLeft, Home } from 'lucide-react';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-navy-50 px-6">
      <div className="max-w-md text-center">
        <ShieldX className="mx-auto h-20 w-20 text-red-400" />
        <h1 className="mt-6 text-4xl font-extrabold text-navy-950">Access Denied</h1>
        <h2 className="mt-2 text-lg font-semibold text-navy-700">403 Unauthorized</h2>
        <p className="mt-3 text-navy-600">
          You do not have permission to view this page.
          If you believe this is an error, please contact your system administrator.
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

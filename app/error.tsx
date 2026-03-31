'use client';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps): JSX.Element {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 px-4">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
        Something went wrong
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 text-center max-w-sm">
        {error?.message || 'An unexpected error occurred. Please try again.'}
      </p>
      <button
        onClick={reset}
        className="px-5 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition-colors"
      >
        Try again
      </button>
    </div>
  );
}

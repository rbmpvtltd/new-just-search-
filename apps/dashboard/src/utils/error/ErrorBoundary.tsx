import type React from "react";
import type { ReactNode } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

// Fallback component for rendering error UI
const ErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  return (
    <div>
      <h2>Something went wrong.</h2>
      <p>{error?.message || "An unexpected error occurred."}</p>
      <button type="button" onClick={resetErrorBoundary}>
        Try Again
      </button>
    </div>
  );
};

// ErrorBoundary wrapper component
interface ErrorBoundaryWrapperProps {
  children: ReactNode;
}

export const ErrorBoundaryWrapper: React.FC<ErrorBoundaryWrapperProps> = ({
  children,
}) => {
  return (
    <ErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={(error, info) => {
        // Log error to console or error reporting service
        console.error("Error caught in ErrorBoundary:", error, info);
      }}
      onReset={() => {
        // Optional: Add logic to reset app state if needed
      }}
    >
      {children}
    </ErrorBoundary>
  );
};

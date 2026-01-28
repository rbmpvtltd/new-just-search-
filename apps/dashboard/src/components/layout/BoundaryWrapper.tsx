import { type ReactNode, Suspense } from "react";
import { ErrorBoundary, type FallbackProps } from "react-error-boundary";

// Define the fallback component for errors
const DefaultErrorFallback: React.FC<FallbackProps> = ({
  error,
  resetErrorBoundary,
}) => {
  console.error("Error caught in ErrorBoundary:", error);
  return (
    <div>
      <h2>Something went wrong</h2>
      <p>{"An unexpected error occurred."}</p>
      <button type="button" onClick={resetErrorBoundary}>
        Try Again
      </button>
    </div>
  );
};

// Define props for BoundaryWrapper
interface BoundaryWrapperProps {
  children: ReactNode;
  fallback?: ReactNode; // Optional override for Suspense loading
  errorFallback?: React.FC<FallbackProps> | ReactNode; // Allow custom component or JSX for error
}

// BoundaryWrapper component
const BoundaryWrapper: React.FC<BoundaryWrapperProps> = ({
  children,
  fallback = <div>Loading...</div>,
  errorFallback = DefaultErrorFallback,
}) => {
  return (
    <ErrorBoundary
      {...(typeof errorFallback === "function"
  ? { FallbackComponent: errorFallback }
  : { fallback: errorFallback })}
      onError={(error, info) => {
        console.error("Error caught in ErrorBoundary:", error, info);
      }}
      onReset={() => {
        // Optional: Reset app state if needed
      }}
    >
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
};

export default BoundaryWrapper;

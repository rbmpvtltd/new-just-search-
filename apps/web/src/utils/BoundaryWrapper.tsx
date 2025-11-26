import { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Spinner } from "@/components/ui/spinner";

type BoundaryWrapperProps = {
  children: ReactNode;
  fallback?: ReactNode; // optional override for loading
  errorFallback?: ReactNode; // optional override for error
};

export default function BoundaryWrapper({
  children,
  fallback = <Spinner />,
  errorFallback = "Something went wrong",
}: BoundaryWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

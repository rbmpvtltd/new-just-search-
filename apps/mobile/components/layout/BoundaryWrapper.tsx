import { type ReactNode, Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Text, View } from "react-native";
import { Loading } from "../ui/Loading";
import { SomethingWrong } from "../ui/SomethingWrong";

type BoundaryWrapperProps = {
  children: ReactNode;
  fallback?: ReactNode; // optional override for loading
  errorFallback?: ReactNode; // optional override for error
};

export default function BoundaryWrapper({
  children,
  fallback = <Loading position="center" />,
  errorFallback = <SomethingWrong />,
}: BoundaryWrapperProps) {
  return (
    <ErrorBoundary fallback={errorFallback}>
      <Suspense fallback={fallback}>{children}</Suspense>
    </ErrorBoundary>
  );
}

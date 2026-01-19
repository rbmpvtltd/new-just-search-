import SearchPageClient from "@/features/home/SearchClient";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense fallback={null}>
      <SearchPageClient />
    </Suspense>
  );
}
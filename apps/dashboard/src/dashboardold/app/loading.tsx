import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="flex w-full h-[100vh] bg-white justify-center items-center">
      <Skeleton className="w-96 h-96" />
    </div>
  );
}

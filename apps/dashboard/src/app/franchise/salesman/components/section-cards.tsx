import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OutputTrpcType } from "@/trpc/type";
export type TotalSalesman =
  | OutputTrpcType["franchiseSalemanRouter"]["totalSalesman"]
  | null;
export function SectionCards({ data }: { data: TotalSalesman }) {
  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card  grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-[#FE9F43] text-white">
        <CardHeader>
          <CardDescription className="text-white">
            Total Salesman
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

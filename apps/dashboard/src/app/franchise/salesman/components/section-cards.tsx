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
  console.log("data---------------------", data);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card  grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-[#FE9F43] text-white">
        <CardHeader>
          <CardDescription className="text-white">Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.totalUsers ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#092C4C]">
        <CardHeader>
          <CardDescription className="text-white">
            Total Salesman
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.allSalesman ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#0E9384]">
        <CardHeader>
          <CardDescription className="text-white">
            Business Listings
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.businessSq[0]?.count ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#155EEF]">
        <CardHeader>
          <CardDescription className="text-white">
            Hire Listings
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.hireSq[0]?.count ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

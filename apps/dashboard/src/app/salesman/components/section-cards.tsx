import { IconTrendingDown, IconTrendingUp } from "@tabler/icons-react";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardAction,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OutputTrpcType } from "@/trpc/type";
export type TotalUsers =
  | OutputTrpcType["salesmanUserRouter"]["totalUsers"]
  | null;
export function SectionCards({ data }: { data: TotalUsers }) {
  const totalUsers =
    Number(data?.allBusiness ?? 0) + Number(data?.allhire ?? 0);

  return (
    <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card  grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
      <Card className="@container/card bg-[#FE9F43] text-white">
        <CardHeader>
          <CardDescription className="text-white">Total Users</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {totalUsers ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#092C4C]">
        <CardHeader>
          <CardDescription className="text-white">
            Total Business Users
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.allBusiness ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card className="@container/card text-white bg-[#0E9384]">
        <CardHeader>
          <CardDescription className="text-white">
            Total Hire Users
          </CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {data?.allhire ?? 0}
          </CardTitle>
        </CardHeader>
      </Card>
    </div>
  );
}

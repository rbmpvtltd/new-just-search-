import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { OutputTrpcType } from "@/trpc/type";
export type TotalSalesman =
  | OutputTrpcType["franchiseSalesmanRouter"]["totalSalesman"]
  | null;
export function SectionCards({ data }: { data: TotalSalesman }) {
  const totalPaidUsers =
    (data?.paidBusinessUsers ?? 0) + (data?.paidHireUsers ?? 0);
  const totalUnPaidUsers = (data?.totalUsers ?? 0) - totalPaidUsers;
  return (
    <div className="w-full">
      <div className="px-4 lg:px-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Hello,{" "}
              <span className="text-primary">{data?.name ?? "User"}</span>
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              Here’s a quick overview of your performance
            </p>
          </div>

          <div className="flex items-center gap-3 bg-gray-100 border border-gray-200 rounded-xl px-4 py-2">
            <span className="text-xs font-medium text-gray-500 uppercase ">
              Refer Code
            </span>
            <span className="font-mono text-sm font-semibold text-gray-900 ">
              {data?.referCode ?? "—"}
            </span>
          </div>
        </div>
      </div>
      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card  grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card text-white bg-[#0E9384]">
          <CardHeader>
            <CardDescription className="text-white">
              Total Business Listings
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.businessSq[0]?.count ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card text-white bg-[#155EEF]">
          <CardHeader>
            <CardDescription className="text-white">
              Total Hire Listings
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.hireSq[0]?.count ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card bg-[#FE9F43] text-white">
          <CardHeader>
            <CardDescription className="text-white">
              Total Paid Users
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalPaidUsers}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card className="@container/card bg-[#31a53d] text-white">
          <CardHeader>
            <CardDescription className="text-white">
              Total Unpaid Users
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUnPaidUsers}
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
      </div>
    </div>
  );
}

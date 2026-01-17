import {
  Card,
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
    <div className="w-full">
      <div className="px-4 lg:px-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 bg-white rounded-2xl border border-gray-200 p-5 shadow-sm">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900">
              Welcome back,{" "}
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

      <div className="*:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4">
        <Card className="@container/card bg-[#155EEF] text-white rounded-2xl">
          <CardHeader>
            <CardDescription className="text-white/90">
              Total Paid Users
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.paidUsers ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card bg-[#FE9F43] text-white rounded-2xl">
          <CardHeader>
            <CardDescription className="text-white/90">
              Total Unpaid Users
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {totalUsers - (data?.paidUsers ?? 0)}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card bg-[#092C4C] text-white rounded-2xl">
          <CardHeader>
            <CardDescription className="text-white/90">
              Total Business Listings
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.allBusiness ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>

        <Card className="@container/card bg-[#0E9384] text-white rounded-2xl">
          <CardHeader>
            <CardDescription className="text-white/90">
              Total Hire Listings
            </CardDescription>
            <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
              {data?.allhire ?? 0}
            </CardTitle>
          </CardHeader>
        </Card>
      </div>
    </div>
  );
}

"use client";
import { trpcServer } from "@/trpc/trpc-server";
import { DataTable, type QueryFnContext } from "@/components/table/data-table";
import { columns } from "./columns";

export default function Page() {
  const queryConfig = {
    queryKey: ["tasks"],
    queryFn: async ({ pagination }: QueryFnContext) => {
      const result = await trpcServer.test.table.query({
        pagination: {
          pageIndex: pagination?.pageIndex || 0,
          pageSize: pagination?.pageSize || 10,
        },
      });

      return {
        data: result?.data || [],
        totalPages: result?.totalPages || 0,
        totalCount: result?.totalCount || 0,
      };
    },
  };
  return (
    <div className="container mx-auto py-10">
      <DataTable
        columns={columns}
        queryConfig={queryConfig}
        manualPagination={true}
        manualSorting={true}
        manualFiltering={true}
      />
    </div>
  );
}

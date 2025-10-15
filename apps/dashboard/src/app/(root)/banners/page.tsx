"use client";
import { DataTable, type QueryFnContext } from "@/components/table/data-table";
import { useTRPC } from "@/trpc/client";
import { trpcServer } from "@/trpc/trpc-server";
import { columns } from "./table/columns";
import { DataTableToolbar } from "./table/toolbar";

export default function Page() {
  const trpc = useTRPC();
  const queryConfig = {
    queryKey: trpc.adminBanner.list.queryKey(),
    queryFn: async ({
      pagination,
      sorting,
      filters,
      globalFilter,
    }: QueryFnContext) => {
      const result = await trpcServer.adminBanner.list.query({
        sorting,
        pagination: {
          pageIndex: pagination?.pageIndex || 0,
          pageSize: pagination?.pageSize || 10,
        },
        filters,
        globalFilter,
      });

      filters.map((item) => {
        item.id;
        item.value;
      });

      return {
        data: result?.data || [],
        totalPages: result?.totalPages || 0,
        totalCount: result?.totalCount || 0,
      };
    },
  };
  return (
    <div className="container ">
      <DataTable
        columns={columns}
        Toolbar={DataTableToolbar}
        queryConfig={queryConfig}
        manualPagination={true}
        manualSorting={true}
        manualFiltering={true}
      />
    </div>
  );
}

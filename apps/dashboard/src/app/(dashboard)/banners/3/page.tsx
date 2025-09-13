"use client";
import type { ColumnDef } from "@tanstack/react-table";

import { z } from "zod";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { trpcServer } from "@/trpc/trpc-server";
import { DataTable } from "@/components/table/data-table";

export const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
});

export type Task = z.infer<typeof taskSchema>;

export const columns: ColumnDef<Task>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("id")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("title")}</div>,
  },
];

export default function Page() {
  const queryConfig = {
    queryKey: ["tasks"],
    queryFn: async ({ pagination, sorting, filters }: any) => {
      return await trpcServer.test.table.query({
        pagination: {
          pageIndex: pagination?.pageIndex || 0,
          pageSize: pagination?.pageSize || 10,
        },
      });
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

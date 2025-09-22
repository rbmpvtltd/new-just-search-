"use client";

import {
  type QueryFunctionContext,
  type QueryOptions,
  useQuery,
} from "@tanstack/react-query";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import * as React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataTablePagination } from "./data-table-pagination";

// import { DataTableToolbar } from "./data-table-toolbar";

interface QueryData<TData> {
  data: TData[];
  totalPages: number;
  totalCount: number;
}

interface QueryContext extends QueryFunctionContext {
  pagination: { pageIndex: number; pageSize: number };
  sorting: SortingState;
  filters: ColumnFiltersState;
}

interface CustomQueryOptions<TData> extends QueryOptions<QueryData<TData>> {
  queryFn: (context: QueryContext) => Promise<QueryData<TData>>;
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  queryConfig: CustomQueryOptions<TData>;
  manualPagination?: boolean;
  manualSorting?: boolean;
  manualFiltering?: boolean;
}

// interface DataTableProps<TData, TValue> {
//   columns: ColumnDef<TData, TValue>[];
//   queryConfig: QueryOptions;
//   manualPagination?: boolean;
//   manualSorting?: boolean;
//   manualFiltering?: boolean;
// }

export function DataTable<TData, TValue>({
  columns,
  queryConfig,
  manualPagination = true,
  manualSorting = false,
  manualFiltering = false,
}: DataTableProps<TData, TValue>) {
  const [rowSelection, setRowSelection] = React.useState({});
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    [],
  );
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [pagination, setPagination] = React.useState({
    pageIndex: 0,
    pageSize: 10,
  });

  const { data, isLoading, isError, error } = useQuery({
    ...queryConfig,
    queryKey: [
      ...(Array.isArray(queryConfig.queryKey)
        ? queryConfig.queryKey
        : [queryConfig.queryKey]),
      pagination,
      sorting,
      columnFilters,
    ],
    queryFn: (context) =>
      queryConfig.queryFn({
        ...context,
        pagination,
        sorting,
        filters: columnFilters,
      }),
  });

  // ALWAYS call useReactTable immediately after state hooks - never after conditional returns
  const table = useReactTable({
    data: data?.data || [],
    columns,
    state: {
      sorting,
      pagination,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    initialState: {
      pagination: {
        pageIndex: 0,
        pageSize: 10,
      },
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    manualPagination,
    manualSorting,
    manualFiltering,
    pageCount: data?.totalPages ?? -1,
    rowCount: data?.totalCount ?? 0,
  });

  // Handle loading and error states AFTER all hooks are called
  if (isLoading && !data) {
    return <div>Loading initial data...</div>;
  }

  if (isError) {
    return <div>Error: {error?.message}</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      {/* <DataTableToolbar table={table} /> */}
      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} colSpan={header.colSpan}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  );
}

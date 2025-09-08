"use client";
import { getRowRange } from "@/utils/pagination";
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  initialPageSize?: number;
  pageSizeOptions?: number[]; // e.g. [5,10,20,50]
}
export function DataTable<TData, TValue>({
  columns,
  data,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 20, 50],
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const table = useReactTable({
    data,
    columns,
    state: { sorting, pagination, globalFilter },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const pageCount = table.getPageCount();
  const pageIndex = table.getState().pagination.pageIndex;
  const pageSize = table.getState().pagination.pageSize;
  // const totalRows = table.getFilteredRowModel().rows.length;
  // const rowStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  // const rowEnd = Math.min((pageIndex + 1) * pageSize, totalRows);

  const { rowStart, rowEnd, totalRows } = getRowRange(table);
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-semibold">Data Table</h2>
        <div className="flex items-center gap-2">
          <input
            type="text"
            value={globalFilter ?? ""}
            onChange={(e) => table.setGlobalFilter(String(e.target.value))}
            placeholder="Search..."
            className="border px-2 py-1 rounded text-sm"
          />
          <div className="flex items-center gap-2">
            <label htmlFor="">Rows</label>
            <select
              value={pageSize}
              onChange={(e) => table.setPageSize(Number(e.target.value))}
              className="px-2 py-1 rounded border"
            >
              {pageSizeOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-md border">
        <table className="w-full border-collapse">
          <thead className="bg-neutral-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <th
                    key={header.id}
                    className="px-4 text-left text-sm font-medium"
                    onClick={header.column.getToggleSortingHandler()}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                    {{
                      asc: " 🔼",
                      desc: " 🔽",
                    }[header.column.getIsSorted() as string] ?? null}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <tr key={row.id} className="border-t">
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id} className="px-4 py-2 text-sm">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={columns.length}
                  className="h-24 text-center text-sm"
                >
                  No Result
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-center gap-2 p-2 text-sm">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => table.setPageIndex(0)}
              disabled={!table.getCanPreviousPage()}
              aria-label="First page"
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              {"« First"}
            </button>

            <button
              type="button"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              aria-label="Previous"
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              Next
            </button>

            <button
              type="button"
              onClick={() => table.setPageIndex(Math.max(0, pageCount - 1))}
              disabled={!table.getCanNextPage()}
              aria-label="Last page"
              className="px-3 py-1 border rounded disabled:opacity-50"
            >
              {"Last »"}
            </button>

            <div className="flex items-center gap-3">
              <div className="">
                Page <strong>{pageIndex + 1}</strong> of{" "}
                <strong>{pageCount}</strong>
              </div>

              <div className=" flex items-center gap-2">
                {/** biome-ignore lint/a11y/noLabelWithoutControl: <explanation> */}
                <label className="text-sm"> Go to</label>
                <input
                  type="number"
                  min={1}
                  max={pageCount || 1}
                  value={pageIndex + 1}
                  onChange={(e) => {
                    const val = e.target.value ? Number(e.target.value) - 1 : 0;
                    if (!Number.isNaN(val)) {
                      const next = Math.max(
                        0,
                        Math.min(val, Math.max(0, pageCount - 1)),
                      );
                      table.setPageIndex(next);
                    }
                  }}
                  className="w-16 px-2 py-1 rounded border"
                />
              </div>

              <div className="text-sm">
                Showing <strong>{rowStart}</strong>- <strong>{rowEnd}</strong>{" "}
                of <strong>{totalRows}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import type { Table } from "@tanstack/react-table";

export function getRowRange<TData>(table: Table<TData>) {
  const { pageIndex, pageSize } = table.getState().pagination;
  const totalRows = table.getPrePaginationRowModel().rows.length;
  const currentRows = table.getRowModel().rows.length;

  const rowStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
  const rowEnd = totalRows === 0 ? 0 : rowStart + currentRows - 1;

  return { rowStart, rowEnd, totalRows };
}

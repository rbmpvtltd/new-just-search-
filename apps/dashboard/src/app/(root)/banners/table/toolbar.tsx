"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/input-debounced";
import { AddBanner } from "../form/add.form";
import { active, type } from "./data";
import { MuiltDeleteButton } from "../form/delete.form";
import { MuiltActiveButton } from "../form/active.form";

interface DataTableToolbarProps<TData> {
  table: Table<TData>;
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0;

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center gap-2">
        <DebouncedInput
          placeholder="Search ..."
          value={(table.getState().globalFilter as string) ?? ""}
          onChange={(value) => table.setGlobalFilter(String(value))}
          className="h-8 w-[150px] lg:w-[250px]"
        />

        {/* const allowedColumns = ["id", "route", "photo", "is_active", "type"]; */}
        {table.getColumn("isActive") && (
          <DataTableFacetedFilter
            column={table.getColumn("isActive")}
            title="is_active"
            options={active}
          />
        )}
        {table.getColumn("type") && (
          <DataTableFacetedFilter
            column={table.getColumn("type")}
            title="type"
            options={type}
          />
        )}
        {isFiltered && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => table.resetColumnFilters()}
          >
            Reset
            <X />
          </Button>
        )}
      </div>
      <div className="flex items-center gap-2">
        <MuiltActiveButton />
        <MuiltDeleteButton />
        <DataTableViewOptions table={table} />
        <AddBanner />
      </div>
    </div>
  );
}

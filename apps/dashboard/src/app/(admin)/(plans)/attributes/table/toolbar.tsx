"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { DataTableFacetedFilter } from "@/components/table/data-table-faceted-filter";
import { DataTableViewOptions } from "@/components/table/data-table-view-options";
import { Button } from "@/components/ui/button";
import { DebouncedInput } from "@/components/ui/input-debounced";
import { MuiltActiveButton } from "../form/active.form";
import { AddNewEntiry } from "../form/add.form";
import { MuiltDeleteButton } from "../form/delete.form";
import { MuiltPopularButton } from "../form/popular.form";
import { active } from "./data";

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
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            column={table.getColumn("status")}
            title="is_active"
            options={active}
            type="select"
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
        <MuiltPopularButton />
        <MuiltDeleteButton />
        <DataTableViewOptions table={table} />
        <AddNewEntiry />
      </div>
    </div>
  );
}

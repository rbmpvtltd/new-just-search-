"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import type { OutputTrpcType, UnwrapArray } from "@/trpc/type";
import { EditEntiry } from "../form/edit.form";
import { useTableStore } from "../store";

function SelectCell({ id }: { id: number }) {
  const select = useTableStore((state) => state.select);
  const toggleSelect = useTableStore((state) => state.toggleSelect);

  return (
    <Checkbox
      checked={select.includes(id)}
      onCheckedChange={() => toggleSelect(id)}
      aria-label="Select row"
      className="translate-y-0.5"
    />
  );
}

function ActionCell({ id }: { id: number }) {
  return <EditEntiry id={id} />;
}

function ActiveCell({ isActive, id }: { isActive: boolean; id: number }) {
  const allActive = useTableStore((state) => state.active);
  const toggleActive = useTableStore((state) => state.toggleActive);
  const isSelected = allActive.filter((item) => item.id === id)[0];
  const active = isSelected ? isSelected.isActive : isActive;
  const handleToggle = () => {
    toggleActive(id, !active);
  };

  return (
    <Checkbox
      checked={active}
      onCheckedChange={handleToggle}
      aria-label="Select all"
      className="translate-y-0.5"
    />
  );
}

function SelectHeader({ ids }: { ids: number[] }) {
  const select = useTableStore((state) => state.select);
  const addSelect = useTableStore((state) => state.addSelect);
  const deleteManySelect = useTableStore((state) => state.deleteManySelect);

  // Derived state
  const allSelected = ids.every((id) => select.includes(id));
  const someSelected = ids.some((id) => select.includes(id));

  const handleToggleAll = () => {
    if (allSelected) {
      // Deselect all
      deleteManySelect(ids);
    } else {
      // Select all (only those not already selected)
      ids.forEach((id) => {
        if (!select.includes(id)) {
          addSelect(id);
        }
      });
    }
  };

  return (
    <Checkbox
      checked={allSelected || (someSelected && "indeterminate")}
      onCheckedChange={handleToggleAll}
      aria-label="Select all"
      className="translate-y-0.5"
    />
  );
}

type ListerArray = OutputTrpcType["adminAttributesRouter"]["list"]["data"];
type Lister = UnwrapArray<ListerArray>;

export const columns: ColumnDef<Lister>[] = [
  {
    id: "select",
    header: ({ table }) => {
      const currentPageIds = table
        .getRowModel()
        .rows.map((row) => row.original.id);
      return <SelectHeader ids={currentPageIds} />;
    },
    cell: ({ row }) => <SelectCell id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-20">{row.original.id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "planId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Plan ID" />
    ),
    cell: ({ row }) => <div className="w-20">{row.original.planId}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.original.name || "No Name"}
      </div>
    ),
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => (
      <ActiveCell
        id={row.original.id}
        isActive={row.original.isAvailable ?? false}
      />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div>{row?.original?.createdAt?.toLocaleDateString() ?? "null"}</div>
    ),
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => <ActionCell id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
];

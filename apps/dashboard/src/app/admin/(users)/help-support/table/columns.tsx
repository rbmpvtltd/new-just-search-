"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import type { OutputTrpcType, UnwrapArray } from "@/trpc/type";
import ChangeStatus from "../form/change.status";
import { ViewChat } from "../form/edit.form";
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
  return <ViewChat id={id} />;
}

// SelectHeader.tsx (or inline)
//

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

type SubcategoryArray =
  OutputTrpcType["adminHelpAndSupportRouter"]["list"]["data"];
type Subcategory = UnwrapArray<SubcategoryArray>;

export const columns: ColumnDef<Subcategory>[] = [
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
    accessorKey: "tokenNumber",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Token Number" />
    ),
    cell: ({ row }) => row.original.tokenNumber || "No Token Number",
  },
  {
    accessorKey: "subject",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subject " />
    ),
    cell: ({ row }) => row.original.subject || "No Name",
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (row.original.status === 1 ? "Active" : "Closed"),
  },

  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => row?.original?.createdAt?.toLocaleDateString() ?? "null",
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => (
      <div className="flex gap-4 items-center justify-center">
        <ActionCell id={row.original.id} />
        <ChangeStatus id={row.original.id} status={row?.original?.status} />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
];

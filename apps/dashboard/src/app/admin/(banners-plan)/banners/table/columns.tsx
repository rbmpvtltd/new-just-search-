"use client";

import type { ColumnDef } from "@tanstack/react-table";
import Image from "next/image";
import { CldImage } from "next-cloudinary";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import type { OutputTrpcType, UnwrapArray } from "@/trpc/type";
import { EditBanner } from "../form/edit.form";
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
  return <EditBanner id={id} />;
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

type BannerArray = OutputTrpcType["adminBannerRouter"]["list"]["data"];
type Banner = UnwrapArray<BannerArray>;

export const columns: ColumnDef<Banner>[] = [
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
    accessorKey: "photo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Photo" />
    ),
    cell: ({ row }) =>
      row.original.photo ? (
        <Image
          width="100"
          height="100"
          className="border rounded "
          src={`${process.env.NEXT_PUBLIC_IMAGE_UPLOAD_URL}/public${row.original.photo}`}
          alt="cloudinary image not loaded"
        />
      ) : (
        "no photo"
      ),
  },
  {
    accessorKey: "route",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Route" />
    ),
    cell: ({ row }) => (
      <div className="max-w-[200px] truncate">
        {row.original.route || "No route"}
      </div>
    ),
  },
  {
    accessorKey: "is_active",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Active" />
    ),
    cell: ({ row }) => (
      <ActiveCell
        id={row.original.id}
        isActive={row.original.isActive ?? false}
      />
    ),
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Type" />
    ),
    cell: ({ row }) => <div>{row.original.type}</div>,
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => <div>{row.original.createdAt.toLocaleDateString()}</div>,
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => <ActionCell id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
];

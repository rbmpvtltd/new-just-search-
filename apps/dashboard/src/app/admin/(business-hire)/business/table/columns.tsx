"use client";

import type { ListingStatus } from "@repo/db";
import type { ColumnDef } from "@tanstack/react-table";
import { CldImage } from "next-cloudinary";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

function ActiveCell({
  listingStatus,
  id,
}: {
  listingStatus: ListingStatus;
  id: number;
}) {
  const allStatus = useTableStore((state) => state.listingStatusList);
  const toggleStatus = useTableStore((state) => state.toggleListingStatus);
  const isSelected = allStatus.filter((item) => item.id === id)[0];
  const status = isSelected ? isSelected.listingStatus : listingStatus;

  const changeValue = (value: ListingStatus) => {
    toggleStatus(id, value);
  };

  return (
    <Select defaultValue={status} onValueChange={changeValue}>
      <SelectTrigger className="w-[120px]">
        <SelectValue placeholder="Select" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Pending">Pending</SelectItem>
        <SelectItem value="Approved">Approved</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
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

type SubcategoryArray = OutputTrpcType["adminBusinessRouter"]["list"]["data"];
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
    accessorKey: "photo",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Photo" />
    ),
    cell: ({ row }) =>
      row.original.photo ? (
        <CldImage
          width="100"
          height="100"
          className="border rounded "
          src={row.original.photo}
          alt="cloudinary image not loaded"
        />
      ) : (
        "no photo"
      ),
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Name" />
    ),
    cell: ({ row }) => row.original.name || "No Name",
  },
  {
    accessorKey: "phone",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Phone Number" />
    ),
    cell: ({ row }) => row.original.phone || "No Name",
  },
  {
    accessorKey: "city",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="city name" />
    ),
    cell: ({ row }) => row.original.city || "No Name",
  },
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Category Name" />
    ),
    cell: ({ row }) => row.original.category,
  },
  {
    accessorKey: "subcategories",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Subcategories Name" />
    ),
    cell: ({ row }) => row.original.subcategories,
  },

  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => (
      <ActiveCell
        id={row.original.id}
        listingStatus={row.original.status ?? "Pending"}
      />
    ),
  },
  {
    accessorKey: "created_at",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) =>
      row?.original?.created_at?.toLocaleDateString() ?? "null",
  },
  {
    id: "action",
    header: () => <div className="text-center">Action</div>,
    cell: ({ row }) => <ActionCell id={row.original.id} />,
    enableSorting: false,
    enableHiding: false,
  },
];

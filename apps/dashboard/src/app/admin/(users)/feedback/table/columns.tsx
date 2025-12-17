"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/table/data-table-column-header";
import { useTableStore } from "../store";
import { EditBanner } from "../form/edit.form";
import type { OutputTrpcType, UnwrapArray } from "@/trpc/type";

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

type FeedbackArray = OutputTrpcType["adminFeedbackRouter"]["list"]["data"];
type Feedback = UnwrapArray<FeedbackArray>;

export const columns: ColumnDef<Feedback>[] = [
  {
    accessorKey: "id",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="ID" />
    ),
    cell: ({ row }) => <div className="w-20">{row.original.id}</div>,
    enableHiding: false,
  },
  {
    accessorKey: "feedback_type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Feedback Type" />
    ),
    cell: ({ row }) => (
      <div className="whitespace-normal">
        {row.original.feedbackType.join(",") ?? "NO Type"}
      </div>
    ),
  },
  {
    accessorKey: "additional_feedback",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Additional Feedback" />
    ),
    cell: ({ row }) => <div>{row.original.additionalFeedback}</div>,
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
];

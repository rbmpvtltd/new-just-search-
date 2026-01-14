"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import { useTableStore } from "../store";

export function MuiltActiveButton() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const status = useTableStore((state) => state.listingStatusList);
  const empty = useTableStore((state) => state.emptyActive);
  const isActiveExist = status.length >= 1;
  // const isPending = false;

  const { mutate, isPending } = useMutation(
    trpc.adminBusinessRouter.multiactive.mutationOptions(),
  );

  const updatedStatus = status.map((item) => ({
    id: item.id,
    listingStatus: item.listingStatus,
  }));
  const buttonDisable = !isActiveExist || isPending;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={buttonDisable} className="">
          {isPending ? "Saving..." : "Save"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Change Status</DialogTitle>
        <DialogDescription>
          Are you sure you wanna change status
        </DialogDescription>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            disabled={isPending}
            onClick={() => {
              mutate(updatedStatus, {
                onSuccess: async (data) => {
                  if (data.success) {
                    const queryClient = getQueryClient();
                    await queryClient.invalidateQueries({
                      queryKey: trpc.adminBusinessRouter.list.queryKey(),
                    });
                    setTimeout(() => {
                      empty();
                    });
                    setOpen(false);
                  }
                },
              });
            }}
          >
            {isPending ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

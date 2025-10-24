"use client";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useTableStore } from "../store";
import { getQueryClient } from "@/trpc/query-client";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function MuiltActiveButton() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const active = useTableStore((state) => state.active);
  const empty = useTableStore((state) => state.emptyActive);
  const isActiveExist = active.length >= 1;
  // const isPending = false;

  const { mutate, isPending } = useMutation(
    trpc.adminCategoryRouter.multiactive.mutationOptions(),
  );

  const buttonDisable = !isActiveExist || isPending;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={buttonDisable} className="">
          {isPending ? "Saving..." : "Save Status"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Change Active Banner</DialogTitle>
        <DialogDescription>
          Are you sure you wanna change active banner
        </DialogDescription>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            disabled={isPending}
            onClick={() => {
              mutate(active, {
                onSuccess: async (data) => {
                  if (data.success) {
                    const queryClient = getQueryClient();
                    await queryClient.invalidateQueries({
                      queryKey: trpc.adminCategoryRouter.list.queryKey(),
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

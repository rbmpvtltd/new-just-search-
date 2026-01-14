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

export function MuiltDeleteButton() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const select = useTableStore((state) => state.select);
  const emptySelect = useTableStore((state) => state.emptySelect);

  const { mutate: deleteMany, isPending } = useMutation(
    trpc.adminPlanRouter.multidelete.mutationOptions(),
  );

  const isActiveExist = select.length >= 1;

  const buttonDisable = !isActiveExist || isPending;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={buttonDisable} variant="destructive">
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Delete Selected</DialogTitle>

        <DialogDescription>
          Are you sure you wanna delete selected plan
        </DialogDescription>
        <DialogFooter className="mt-2">
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>

          <Button
            variant="destructive"
            disabled={isPending}
            onClick={() => {
              deleteMany(
                { ids: select },
                {
                  onSuccess: (data) => {
                    if (data.success) {
                      const queryClient = getQueryClient();
                      queryClient.invalidateQueries({
                        queryKey: trpc.adminPlanRouter.list.queryKey(),
                      });
                      setTimeout(() => {
                        emptySelect();
                      });

                      setOpen(false);
                    }
                  },
                },
              );
            }}
          >
            {isPending ? "Deleting..." : "Delete"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

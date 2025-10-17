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
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";

export function MuiltDeleteButton() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const select = useTableStore((state) => state.select);

  const { mutate: deleteMany, isPending } = useMutation(
    trpc.adminBanner.multidelete.mutationOptions(),
  );

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={isPending} variant="destructive">
          {isPending ? "Deleting..." : "Delete"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Delete Selected</DialogTitle>
        Are you sure you wanna delete selected banner
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
                        queryKey: trpc.adminBanner.list.queryKey(),
                      });
                      console.log("Yes data deleted  ...");
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

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

export function MuiltPopularButton() {
  const [open, setOpen] = useState(false);
  const trpc = useTRPC();
  const active = useTableStore((state) => state.popular);
  const empty = useTableStore((state) => state.emptyPopular);
  const isActiveExist = active.length >= 1;
  // const isPending = false;

  const { mutate, isPending } = useMutation(
    trpc.adminCategoryRouter.multipopular.mutationOptions(),
  );

  const buttonDisable = !isActiveExist || isPending;

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button disabled={buttonDisable} className="">
          {isPending ? "Saving..." : "Save Popular"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Change Popular Category</DialogTitle>
        <DialogDescription>
          Are you sure you wanna change Popular category
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

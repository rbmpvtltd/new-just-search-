"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useHireFormStore } from "./shared/store/useCreateHireStore";
import EditHirePage from "./update/edit-hire";

export function EditEntiry({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const clearPage = useHireFormStore((state) => state.clearPage);

  const clearAndSetOpen = (bool: boolean) => {
    if (!open) {
      clearPage();
    }
    setOpen(bool);
  };

  return (
    <Sheet onOpenChange={clearAndSetOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Edit</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] lg:max-w-[80%] w-full p-4">
        <SheetTitle>Edit Hire Listing</SheetTitle>
        {open && (
          <Suspense fallback={<div> loading ...</div>}>
            <div className="overflow-y-scroll">
              <GetData setOpen={clearAndSetOpen} id={id} />
              {/* <GetData /> */}
            </div>
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}

export type SetOpen = (bool: boolean) => void;

function GetData({ setOpen, id }: { setOpen: SetOpen; id: number }) {
  // function GetData() {
  const trpc = useTRPC();

  const { data, isFetching } = useSuspenseQuery(
    trpc.adminHireRouter.edit.queryOptions(
      { id },
      {
        staleTime: 0,
      },
    ),
  );

  if (isFetching) return <Spinner />;

  return <EditHirePage data={data} setOpen={setOpen} />;
}

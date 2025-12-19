"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Suspense, useState } from "react";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useSalesmanFormStore } from "./shared/store/useCreateSalesmanStore";
import { EditSalesmanPage } from "./update/edit-salesman";

export function EditEntiry({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  const clearPage = useSalesmanFormStore((state) => state.clearPage);

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
        <SheetTitle>Edit Salesman</SheetTitle>
        {open && (
          <Suspense fallback={<div> loading ...</div>}>
            <div className="overflow-y-scroll">
              <BoundaryWrapper>
                <GetData setOpen={clearAndSetOpen} id={id} />
              </BoundaryWrapper>
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
    trpc.franchiseSalemanRouter.edit.queryOptions(
      { id },
      {
        staleTime: 0,
      },
    ),
  );

  console.log("Data", data);

  if (isFetching) return <Spinner />;

  return <EditSalesmanPage data={data} setOpen={setOpen} id={id} />;
}

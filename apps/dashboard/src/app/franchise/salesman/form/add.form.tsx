"use client";
import { type Dispatch, type SetStateAction, Suspense, useState } from "react";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { AddSalesmanPage } from "./create/add-salesman";
export function AddNewEntiry() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Add Entry</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] lg:max-w-[80%] w-full p-4">
        <SheetTitle>Add Salesman</SheetTitle>
        {open && (
          <Suspense fallback={<div> loading ...</div>}>
            <div className="overflow-y-scroll">
              <GetData setOpen={setOpen} />
              {/* <GetData /> */}
            </div>
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}

export type SetOpen = Dispatch<SetStateAction<boolean>>;

function GetData({ setOpen }: { setOpen: SetOpen }) {
  return (
    <BoundaryWrapper>
      <AddSalesmanPage setOpen={setOpen} />
    </BoundaryWrapper>
  );
}

"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import AddBusinessPage from "./create/add-business";

export function AddNewEntiry() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Add Entry</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] lg:max-w-[80%] w-full p-4">
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
  // function GetData() {
  const trpc = useTRPC();

  const { data, isFetching } = useSuspenseQuery(
    trpc.adminBusinessRouter.add.queryOptions(undefined, {
      staleTime: 0,
    }),
  );

  if (isFetching) return <Spinner />;

  return <AddBusinessPage data={data} setOpen={setOpen} />;
}

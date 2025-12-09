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
import AddOffer from "./create/AddOffer";
import EditOffer from "./update/EditOffer";

export function EditEntiry({ id }: { id: number }) {
  const [open, setOpen] = useState(false);
  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Edit Entry</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] lg:max-w-[80%] w-full p-4">
        <SheetTitle>Edit Offer</SheetTitle>
        {open && (
          <Suspense fallback={<div> loading ...</div>}>
            <div className="overflow-y-scroll">
              <GetData setOpen={setOpen} id={id} />
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
    trpc.adminOfferRouter.edit.queryOptions(
      {
        offerId: id,
      },
      {
        staleTime: 0,
      },
    ),
  );

  if (isFetching) return <Spinner />;

  return <EditOffer data={data} setOpen={setOpen} />;
}

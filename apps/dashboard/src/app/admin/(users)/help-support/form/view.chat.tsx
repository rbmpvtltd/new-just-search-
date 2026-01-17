"use client";
import { Suspense, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import HelpAndSupportChat from "../chat/HelpAndSupportPrivateChat";

export function ViewChat({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  const clearAndSetOpen = (bool: boolean) => {
    if (!open) {
      // clearPage();
    }
    setOpen(bool);
  };

  return (
    <Sheet onOpenChange={clearAndSetOpen} open={open}>
      <SheetTrigger asChild>
        <Button>View</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] lg:max-w-[80%] w-full p-4">
        <SheetTitle>Chat</SheetTitle>
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
  return <HelpAndSupportChat chatTokenSessionId={id} />;
}

"use client";
import { useTRPC } from "@/trpc/client";
import { asyncHandler } from "@/utils/error/asyncHandler";
import { delToken } from "@/utils/session";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

function Logout() {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.auth.logout.mutationOptions({
      onSuccess: async () => {
        await delToken();
      },
      onError: async () => {
        await delToken();
      },
    }),
  );

  const handleLogout = () => {
    mutate();
  };

  return (
    <div className="flex flex-1 justify-center items-center gap-4 mt-20">
      <Dialog>
        <DialogTrigger>Logout</DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you absolutely sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete your
              account and remove your data from our servers.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={handleLogout}>Logout</Button>
        </DialogContent>
      </Dialog>
      <Button>Go Back</Button>
    </div>
  );
}

export default Logout;

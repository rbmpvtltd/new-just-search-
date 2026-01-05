"use client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTRPC } from "@/trpc/client";

export const VersionBtnComponent = ({
  initialValue,
}: {
  initialValue: string;
}) => {
  const trpc = useTRPC();
  const [value, setValue] = useState(initialValue);
  const { mutate } = useMutation(
    trpc.versionRouter.setLatestVersion.mutationOptions({
      onSuccess: () => {
        toast.success("Success");
      },
    }),
  );
  return (
    <div className="flex gap-2 max-w-sm ml-4">
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Enter version name"
        className="h-11 flex-1"
      />

      <Button
        onClick={() => mutate(value)}
        disabled={!value.trim()}
        className="h-11 px-5"
      >
        Update Version
      </Button>
    </div>
  );
};

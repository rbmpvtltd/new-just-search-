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
    <>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button onClick={() => mutate(value)}>VersionBtnComponent</Button>
    </>
  );
};

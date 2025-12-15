import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";

export default function ChangeStatus({
  id,
  status,
}: {
  id: number;
  status: number;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminHelpAndSupportRouter.changeStatus.mutationOptions(),
  );

  const isClosed = status !== 1;

  return (
    <Button
      disabled={isClosed}
      onClick={() =>
        mutate(
          { chatTokenSessionId: id },
          {
            onSuccess: () => {
              const queryClient = getQueryClient();
              queryClient.invalidateQueries({
                queryKey: trpc.adminHelpAndSupportRouter.list.queryKey(),
              });
            },
          },
        )
      }
    >
      {isClosed ? "Closed" : "Change Status"}
    </Button>
  );
}

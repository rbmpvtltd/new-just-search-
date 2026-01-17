"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  salesmenInsertSchema,
  salesmenUpdateSchema,
} from "@repo/db/dist/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import { FormField } from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { SetOpen } from "../../../edit.form";
import { useSalesmanFormStore } from "../../../shared/store/useCreateSalesmanStore";
import type { EditFranchiseSalesmanType } from "..";

const franchiseSalesmenUpdateSchema = salesmenUpdateSchema.omit({
  userId: true,
  franchiseId: true,
});
type SalesmanUpdateSchema = z.infer<typeof franchiseSalesmenUpdateSchema>;

export default function SalesmanForm({
  id,
  data,
  setOpen,
}: {
  id: number;
  data: EditFranchiseSalesmanType;
  setOpen: SetOpen;
}) {
  console.log("ID", id);

  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.franchiseSalesmanRouter.update.mutationOptions(),
  );
  const formValue = useSalesmanFormStore((s) => s.formValue);
  const prevPage = useSalesmanFormStore((s) => s.prevPage);
  const clearPage = useSalesmanFormStore((s) => s.clearPage);
  const {
    control,
    handleSubmit,
    formState: { isSubmitting },
  } = useForm<SalesmanUpdateSchema>({
    resolver: zodResolver(franchiseSalesmenUpdateSchema),
    defaultValues: {
      referCode: data?.salesmanData?.referCode,
    },
  });

  const onSubmit = async (data: SalesmanUpdateSchema) => {
    useSalesmanFormStore.setState((state) => ({
      formValue: {
        ...state.formValue,
        ...data,
      },
    }));
    const finalData = {
      ...formValue,
      ...data,
      salesmanId: id,
    };

    mutate(finalData, {
      onSuccess: async (data) => {
        if (data?.success) {
          clearPage();
          toast("success", {
            description: data.message,
          });
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.franchiseSalesmanRouter.list.queryKey(),
          });
          setOpen(false);
        }
        console.log("success", data);
      },
      onError: async (error) => {
        if (isTRPCClientError(error)) {
          toast.error("Error", {
            description: error.message,
          });
          console.error("error,", error.message);
        }
      },
    });
  };

  return (
    <div className="min-h-screen p-4 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-xl"
      >
        <div className="flex flex-wrap gap-4 p-8 space-y-8 w-full">
          <div className="w-[60%] ">
            <FormField
              control={control}
              component="input"
              name="referCode"
              label="Refer Code"
              className="border border-gray-700"
              disabled
              defaultValue={String(data.salesmanData?.referCode) ?? "0"}
              placeholder="Enter Suffix Code"
            />
          </div>
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            onClick={prevPage}
            className="bg-orange-500 hover:bg-orange-700 font-bold cursor-pointer"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold cursor-pointer"
          >
            {isSubmitting ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              "SUBMIT"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

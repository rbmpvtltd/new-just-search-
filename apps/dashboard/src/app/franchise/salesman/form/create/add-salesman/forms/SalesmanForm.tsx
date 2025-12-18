"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { salesmenInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import next from "next";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { SetOpen } from "../../../add.form";
import { useSalesmanFormStore } from "../../../shared/store/useCreateSalesmanStore";
import type { AddAdminSalesmanType } from "./ProfileForm";

const franchiseSalesmenInsertSchema = salesmenInsertSchema.omit({
  userId: true,
  franchiseId: true,
});
type SalesmanInsertSchema = z.infer<typeof franchiseSalesmenInsertSchema>;

export default function SalesmanForm({
  data,
  setOpen,
}: {
  data: AddAdminSalesmanType;
  setOpen: SetOpen;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.franchiseSalemanRouter.create.mutationOptions(),
  );
  const formValue = useSalesmanFormStore((s) => s.formValue);
  const prevPage = useSalesmanFormStore((s) => s.prevPage);
  const clearPage = useSalesmanFormStore((s) => s.clearPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SalesmanInsertSchema>({
    resolver: zodResolver(franchiseSalesmenInsertSchema),
    defaultValues: {
      referCode: formValue.referCode,
    },
  });

  const onSubmit = async (data: SalesmanInsertSchema) => {
    useSalesmanFormStore.setState((state) => ({
      formValue: {
        ...state.formValue,
        ...data,
      },
    }));
    const finalData = {
      ...formValue,
      ...data,
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
            queryKey: trpc.franchiseSalemanRouter.list.queryKey(),
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
          <div className="w-[20%]">
            <Label htmlFor="referCode">Prefix Code</Label>
            <Input
              type="text"
              className="mt-2 h-10 border-gray-600 border-2"
              value={data.franchise[0]?.displayName ?? ""}
              disabled
            />
          </div>
          <div className="w-[60%]">
            <FormField
              control={control}
              component="input"
              name="referCode"
              label="Suffix Code"
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

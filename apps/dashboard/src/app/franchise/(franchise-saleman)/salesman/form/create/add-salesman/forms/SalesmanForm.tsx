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
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { SetOpen } from "../../../add.form";
import { useSalesmanFormStore } from "../../../shared/store/useCreateSalesmanStore";
import type { AddAdminSalesmanType } from "./ProfileForm";

const adminSalesmenInsertSchema = salesmenInsertSchema.omit({
  userId: true,
});
type SalesmanInsertSchema = z.infer<typeof adminSalesmenInsertSchema>;

export default function SalesmanForm({
  data,
  setOpen,
}: {
  data: AddAdminSalesmanType;
  setOpen: SetOpen;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminSalemanRouter.create.mutationOptions(),
  );
  const formValue = useSalesmanFormStore((s) => s.formValue);
  const prevPage = useSalesmanFormStore((s) => s.prevPage);
  const clearPage = useSalesmanFormStore((s) => s.clearPage);
  const [code, setCode] = useState<null | string>("");
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<SalesmanInsertSchema>({
    resolver: zodResolver(adminSalesmenInsertSchema),
    defaultValues: {
      franchiseId: formValue.franchiseId,
      referCode: formValue.referCode,
    },
  });
  const franchiseId = useWatch({ control, name: "franchiseId" });
  const { data: dataReferCode, isLoading } = useQuery(
    trpc.adminSalemanRouter.getReferCode.queryOptions({
      franchiseId: Number(franchiseId),
    }),
  );

  useEffect(() => {
    if (dataReferCode?.newReferCode) {
      reset((prev) => {
        if (prev.referCode === dataReferCode.newReferCode) return prev;
        return { ...prev, referCode: dataReferCode.newReferCode };
      });
    }
  }, [dataReferCode, reset]);

  const formFields: FormFieldProps<SalesmanInsertSchema>[] = [
    {
      control,
      label: "Franchise Name",
      name: "franchiseId",
      placeholder: "Enter Franchise Name",
      component: "select",
      options:
        data?.franchise?.map((franchise) => ({
          label: franchise?.displayName ?? "",
          value: franchise?.id,
        })) ?? [],
      error: errors.franchiseId?.message,
    },
    {
      control,
      label: "Refer Code",
      name: "referCode",
      placeholder: "Enter Refer Code",
      component: "input",
      loading: isLoading,
      error: errors.referCode?.message,
    },
  ];

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
    mutate(
      { ...finalData, nextNumber: Number(dataReferCode?.nextNumber) },
      {
        onSuccess: async (data) => {
          if (data?.success) {
            clearPage();
            toast("success", {
              description: data.message,
            });
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
              queryKey: trpc.adminSalemanRouter.list.queryKey(),
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
      },
    );
  };

  return (
    <div className="min-h-screen p-4 ">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="max-w-6xl mx-auto bg-gray-100 rounded-lg shadow-xl"
      >
        <div className="p-8 space-y-8">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
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

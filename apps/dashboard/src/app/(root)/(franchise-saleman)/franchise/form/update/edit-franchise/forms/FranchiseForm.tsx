"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { franchiseInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
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
import type { SetOpen } from "../../../edit.form";
import { useFranchiseFormStore } from "../../../shared/store/useCreateFranchiseStore";
import type { EditAdminFranchiseType } from "..";

export const adminAddFranchiseInsertSchema = franchiseInsertSchema.omit({
  userId: true,
});
type FranchiseInsertSchema = z.infer<typeof adminAddFranchiseInsertSchema>;

export default function FranchiseForm({
  id,
  data,
  setOpen,
}: {
  id: number;
  data: EditAdminFranchiseType;
  setOpen: SetOpen;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminFranchiseRouter.update.mutationOptions(),
  );
  const formValue = useFranchiseFormStore((s) => s.formValue);
  const prevPage = useFranchiseFormStore((s) => s.prevPage);
  const clearPage = useFranchiseFormStore((s) => s.clearPage);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FranchiseInsertSchema>({
    resolver: zodResolver(adminAddFranchiseInsertSchema),
    defaultValues: {
      gstNo: data.franchiseData?.gstNo ?? "",
      referPrifixed: data.franchiseData?.referPrifixed ?? "",
      employeeLimit: data.franchiseData?.employeeLimit ?? NaN,
    },
  });

  const formFields: FormFieldProps<FranchiseInsertSchema>[] = [
    {
      control,
      label: "GST No",
      name: "gstNo",
      placeholder: "Enter GST No",
      component: "input",
      error: errors.gstNo?.message,
    },
    {
      control,
      type: "number",
      label: "Employee Limit",
      name: "employeeLimit",
      placeholder: "Limit of Employee",
      component: "input",
      error: errors.employeeLimit?.message,
    },
    {
      control,
      label: "Refer Code",
      name: "referPrifixed",
      placeholder: "Enter Refer Code",
      component: "input",
      error: errors.referPrifixed?.message,
    },
  ];

  const onSubmit = async (data: FranchiseInsertSchema) => {
    useFranchiseFormStore.setState((state) => ({
      formValue: {
        ...state.formValue,
        ...data,
        employeeLimit: Number(data.employeeLimit),
      },
    }));
    const finalData = {
      ...formValue,
      ...data,
    };

    console.log("Final data", finalData);

    mutate(
      { ...finalData, id },
      {
        onSuccess: async (data) => {
          if (data?.success) {
            clearPage();
            toast("success", {
              description: data.message,
            });
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
              queryKey: trpc.adminFranchiseRouter.list.queryKey(),
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

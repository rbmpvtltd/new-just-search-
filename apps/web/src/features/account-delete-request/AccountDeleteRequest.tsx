"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { requestAccountsInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Swal from "sweetalert2";
import type z from "zod";
import { FormField } from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";

type DeleteRequestSchema = z.infer<typeof requestAccountsInsertSchema>;
export default function AccountDeleteRequestForm() {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.userRouter.accountDeleteRequest.mutationOptions(),
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<DeleteRequestSchema>({
    resolver: zodResolver(requestAccountsInsertSchema),
    defaultValues: {
      reason: "",
    },
  });

  const onSubmit = (data: DeleteRequestSchema) => {
    mutate(data, {
      onSuccess: (data) => {
        Swal.fire({
          title: data?.message,
          icon: "success",
          draggable: true,
        });
      },
      onError: (error) => {
        console.log("Error", error);
        Swal.fire({
          title: error?.message,
          icon: "error",
          draggable: true,
        });
      },
    });
  };
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-3xl bg-white rounded-2xl shadow-lg overflow-hidden"
      >
        {/* Header */}
        <div className="px-8 py-6 border-b border-gray-200 bg-gray-50">
          <h2 className="text-2xl font-semibold text-gray-800">
            Request to Delete Account
          </h2>
          <p className="text-gray-500 text-sm mt-1">
            Please tell us why you’d like to delete your account.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8 space-y-6">
          <div>
            <FormField
              control={control}
              name="reason"
              label="Reason for deleting account"
              component="textarea"
              placeholder="Enter your reason..."
              error={errors?.reason?.message}
              className="w-full min-h-[120px]"
            />
          </div>
        </div>

        <div className="flex justify-end items-center gap-3 px-8 py-6 bg-gray-50 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Spinner className="w-4 h-4" /> Submitting...
              </>
            ) : (
              "Submit"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

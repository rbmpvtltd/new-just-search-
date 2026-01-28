"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm } from "react-hook-form";
import z from "zod";
import { FormField } from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";

export const changePasswordSchema = z
  .object({
    current_password: z
      .string()
      .min(6, { message: "Current password is required" }),
    new_password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    confirm_new_password: z
      .string()
      .min(6, { message: "Please confirm your new password" }),
  })
  .refine((data) => data.new_password !== data.current_password, {
    message: "New password must be different from current password",
    path: ["new_password"],
  })
  .refine((data) => data.new_password === data.confirm_new_password, {
    message: "Password and confirm password do not match",
    path: ["confirm_new_password"],
  });

type ChangePasswordSchema = z.infer<typeof changePasswordSchema>;
export default function ChangePassword() {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.salesmanChangePasswordRouter.update.mutationOptions(),
  );
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ChangePasswordSchema>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      current_password: "",
      new_password: "",
      confirm_new_password: "",
    },
  });

  console.log("Error", errors);

  const onSubmit = (data: ChangePasswordSchema) => {
    console.log("data", data);

    mutate(data, {
      onSuccess: (data) => {
        console.log("Success", data);
      },
      onError: (error) => {
        if (isTRPCClientError(error)) {
          console.error("Error", error.message);
        }
      },
    });
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-semibold text-gray-800">
            Change Password
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Update your account password
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-5">
          <FormField
            control={control}
            name="current_password"
            component="input"
            type="password"
            label="Current Password"
            placeholder="Enter current password"
            error={errors?.current_password?.message}
          />

          <FormField
            control={control}
            name="new_password"
            component="input"
            type="password"
            label="New Password"
            placeholder="Enter new password"
            error={errors?.new_password?.message}
          />

          <FormField
            control={control}
            name="confirm_new_password"
            component="input"
            type="password"
            label="Confirm New Password"
            placeholder="Re-enter new password"
            error={errors?.confirm_new_password?.message}
          />
          <div className="flex justify-end gap-3 px-6 py-4 bg-gray-50 border-t">
            <Button
              type="submit"
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold px-6 py-2 rounded-lg flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <Spinner className="w-4 h-4" />
                  Updating...
                </>
              ) : (
                "Update Password"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

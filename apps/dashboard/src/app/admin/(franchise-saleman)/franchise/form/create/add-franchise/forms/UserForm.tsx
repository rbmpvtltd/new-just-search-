"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { usersInsertSchema } from "@repo/db/dist/schema/auth.schema";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useFranchiseFormStore } from "../../../shared/store/useCreateFranchiseStore";
export const adminAddUserInsertSchema = usersInsertSchema.omit({
  role: true,
});
type UserInsertSchema = z.infer<typeof adminAddUserInsertSchema>;

export default function UserForm() {
  const nextPage = useFranchiseFormStore((s) => s.nextPage);
  const formValue = useFranchiseFormStore((s) => s.formValue);
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserInsertSchema>({
    resolver: zodResolver(adminAddUserInsertSchema),
    defaultValues: {
      displayName: formValue.displayName,
      email: formValue.email,
      password: formValue.password,
      phoneNumber: formValue.phoneNumber,
      status: formValue.status,
    },
  });

  const formFields: FormFieldProps<UserInsertSchema>[] = [
    {
      control,
      label: "Display Name",
      name: "displayName",
      placeholder: "Enter Users Display Name",
      component: "input",
      error: errors.displayName?.message,
    },
    {
      control,
      label: "Email",
      name: "email",
      placeholder: "Enter Users Login Email",
      component: "input",
      error: errors.email?.message,
    },
    {
      control,
      label: "Phone Number",
      name: "phoneNumber",
      placeholder: "Enter Users Login Phone Number",
      component: "input",
      error: errors.phoneNumber?.message,
    },
  ];

  const onSubmit = async (data: UserInsertSchema) => {
    useFranchiseFormStore.setState((state) => ({
      formValue: { ...state.formValue, ...data },
    }));
    nextPage();
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
        <div className="px-8 space-y-8 relative">
          <FormField
            control={control}
            label="Password"
            name="password"
            component="input"
            placeholder="Enter password"
            type={showPassword ? "text" : "password"}
            error={errors.password?.message}
          />
          {showPassword ? (
            <Eye
              className="absolute right-14 top-8 z-10 cursor-pointer text-gray-500"
              onClick={() => {
                setShowPassword(!showPassword);
              }}
            />
          ) : (
            <EyeOff
              className="absolute right-14 top-8 z-10 cursor-pointer text-gray-500"
              onClick={() => setShowPassword(!showPassword)}
            />
          )}
          <FormField
            control={control}
            label="Active"
            name="status"
            component="single-checkbox"
            error={errors.status?.message}
          />
        </div>

        <div className="flex justify-end p-6 border-t border-gray-200">
          <Button
            type="submit"
            disabled={isSubmitting}
            className="bg-orange-500 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded-md min-w-[120px]"
          >
            {isSubmitting ? (
              <>
                <Spinner />
                Loading...
              </>
            ) : (
              "CONTINUE"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

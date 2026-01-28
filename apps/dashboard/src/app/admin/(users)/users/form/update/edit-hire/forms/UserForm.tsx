"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { usersInsertSchema } from "@repo/db/dist/schema/auth.schema";
import { useForm } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useUserFormStore } from "../../../shared/store/useCreateHireStore";
import type { EditAdminUserType } from "..";

type UserInsertSchema = z.infer<typeof usersInsertSchema>;

export default function UserForm({ data }: { data: EditAdminUserType }) {
  const nextPage = useUserFormStore((s) => s.nextPage);
  const formValue = useUserFormStore((s) => s.formValue);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserInsertSchema>({
    resolver: zodResolver(usersInsertSchema),
    defaultValues: {
      displayName: data.userData?.displayName,
      email: data.userData?.email,
      password: data.userData?.password,
      phoneNumber: data.userData?.phoneNumber,
      role: data.userData?.role,
      status: data.userData?.status,
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
    {
      control,
      type: "password",
      label: "Password",
      name: "password",
      placeholder: "Enter Users Login Password",
      component: "input",
      disabled: true,
      error: errors.email?.message,
    },
    {
      control,
      label: "Role",
      name: "role",
      placeholder: "Select Type of category",
      component: "select",
      options: [
        { label: UserRole.business, value: UserRole.business },
        { label: UserRole.hire, value: UserRole.hire },
        { label: UserRole.guest, value: UserRole.guest },
        { label: UserRole.visitor, value: UserRole.visitor },
      ],
      error: errors.role?.message,
    },
    {
      control,
      label: "Active",
      name: "status",
      mainDivClassName: "flex gap-4",
      placeholder: "",
      component: "single-checkbox",
      error: errors.status?.message,
    },
  ];

  const onSubmit = async (data: UserInsertSchema) => {
    useUserFormStore.setState((state) => ({
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

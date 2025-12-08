"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { usersInsertSchema } from "@repo/db/dist/schema/auth.schema";
import { categoryInsertSchema } from "@repo/db/dist/schema/not-related.schema";
import { useMutation } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";

// import { bannerSelectSchema } from "@repo/db/dist/schema/not-related.schema";

type UserSelectSchema = z.infer<typeof usersInsertSchema>;

export function AddNewEntiry() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Add Entry</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <Suspense fallback={<div> loading ...</div>}>
          {open && <AddForm setOpen={setOpen} />}
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}

interface AddForm {
  setOpen: Dispatch<SetStateAction<boolean>>;
}
function AddForm({ setOpen }: AddForm) {
  const trpc = useTRPC();

  const { mutate: create } = useMutation(
    trpc.adminUsersRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserSelectSchema>({
    resolver: zodResolver(usersInsertSchema),
    defaultValues: {
      displayName: "",
      role: "guest",
      email: "",
      password: "",
      phoneNumber: "",
      googleId: null,
    },
  });

  const onSubmit = async (data: UserSelectSchema) => {
    // const files = await uploadToCloudinary([data.photo], "banner");
    // if (!files || !files[0]) {
    //   console.error("file uploading to cloudinary failed");
    //   return;
    // }
    create(data, {
      onSuccess: () => {
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({
          queryKey: trpc.adminCategoryRouter.list.queryKey(),
        });
        setOpen(false);
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  const formFields: FormFieldProps<UserSelectSchema>[] = [
    {
      control,
      label: "Role",
      name: "role",
      placeholder: "Select Type of category",
      component: "select",
      options: Object.values(UserRole).map((item) => ({
        label: item,
        value: item,
      })),
      error: errors.role?.message,
    },
    {
      control,
      label: "Display Name",
      name: "displayName",
      placeholder: "eg: Akki",
      component: "input",
      error: errors.displayName?.message,
    },
    {
      control,
      label: "Email",
      name: "email",
      component: "input",
      error: errors.email?.message,
    },
    {
      control,
      label: "Phone Number",
      name: "phoneNumber",
      mainDivClassName: "flex gap-4",
      error: errors.password?.message,
      component: "input",
    },
    {
      control,
      label: "Password",
      name: "password",
      mainDivClassName: "flex gap-4",
      type: "password",
      component: "input",
      error: errors.password?.message,
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SheetHeader>
        <SheetTitle>Add</SheetTitle>
      </SheetHeader>
      <div className="grid grid-cols-1 gap-6 ">
        {formFields.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      </div>
      <SheetFooter className="mt-2">
        <SheetClose asChild>
          <Button variant="outline">Cancel</Button>
        </SheetClose>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting " : "Save changes"}
        </Button>
      </SheetFooter>
    </form>
  );
}

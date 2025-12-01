"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { notificationInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import type { z } from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
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

const extendedInsertSchema = notificationInsertSchema;

type SelectSchema = z.infer<typeof extendedInsertSchema>;

export function AddNewEntiry() {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Add Entry</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] p-4">
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

  const { data } = useSuspenseQuery(
    trpc.adminNotificationRouter.add.queryOptions(),
  );

  const { mutate: create } = useMutation(
    trpc.adminNotificationRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SelectSchema>({
    resolver: zodResolver(extendedInsertSchema),
    defaultValues: {
      description: "",
      title: "",
      //city: [],
      notificationId: data.newNotificationId,
      //state: [],
      role: [],
      status: true,
      //categoryId: [],
      //subCategoryId: [],
    },
  });

  const onSubmit = async (data: SelectSchema) => {
    create(data, {
      onSuccess: () => {
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({
          queryKey: trpc.adminNotificationRouter.list.queryKey(),
        });
        setOpen(false);
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  const formFields: FormFieldProps<SelectSchema>[] = [
    {
      control,
      label: "Role",
      name: "role",
      placeholder: "Select Type of category",
      component: "checkbox",
      options: [
        { label: UserRole.all, value: UserRole.all },
        { label: UserRole.business, value: UserRole.business },
        { label: UserRole.hire, value: UserRole.hire },
        { label: UserRole.guest, value: UserRole.guest },
        { label: UserRole.visiter, value: UserRole.visiter },
      ],
      error: errors.role?.message,
    },
    // {
    //   control,
    //   label: "Category",
    //   name: "categoryId",
    //   placeholder: "Category",
    //   component: "select",
    //   options:
    //     categories?.map((item) => ({ label: item.label, value: item.value })) ??
    //     [],
    //   error: errors.categoryId?.message,
    // },
    {
      control,
      label: "Title",
      name: "title",
      placeholder: "eg: Notification Title",
      component: "input",
      error: errors.title?.message,
    },
    {
      control,
      label: "description",
      name: "description",
      component: "input",
      error: errors.description?.message,
    },
    {
      control,
      label: "Active",
      name: "status",
      mainDivClassName: "flex gap-4",
      placeholder: "",
      component: "single-checkbox",
      error: errors.state?.message,
    },
  ];

  return (
    <form className="" onSubmit={handleSubmit(onSubmit)}>
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

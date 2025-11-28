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
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";

const extendedInsertSchema = notificationInsertSchema;

type SelectSchema = z.infer<typeof extendedInsertSchema>;

export function AddNewEntiry() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Add Entry</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Suspense fallback={<div> loading ...</div>}>
          {open && <AddForm setOpen={setOpen} />}
        </Suspense>
      </DialogContent>
    </Dialog>
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
      city: null,
      notificationId: data.newNotificationId,
      state: null,
      role: [],
      status: true,
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
    <form onSubmit={handleSubmit(onSubmit)}>
      <DialogHeader>
        <DialogTitle>Add</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 gap-6 ">
        {formFields.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      </div>
      <DialogFooter className="mt-2">
        <DialogClose asChild>
          <Button variant="outline">Cancel</Button>
        </DialogClose>
        <Button disabled={isSubmitting} type="submit">
          {isSubmitting ? "Submitting " : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}

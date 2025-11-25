"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryInsertSchema } from "@repo/db/dist/schema/not-related.schema";
import { notificationInsertSchema } from "@repo/db/dist/schema/user.schema";
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

type CategorySelectSchema = z.infer<typeof extendedInsertSchema>;

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

  const { mutate: create } = useMutation(
    trpc.adminCategoryRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategorySelectSchema>({
    resolver: zodResolver(extendedInsertSchema),
    defaultValues: {
      status: false,
      description: "",
      title: "",
      city: null,
      state: null,
      role: "",
    },
  });

  const onSubmit = async (data: CategorySelectSchema) => {
    const files = await uploadToCloudinary([data.photo], "banner");
    if (!files || !files[0]) {
      console.error("file uploading to cloudinary failed");
      return;
    }
    create(
      {
        ...data,
        photo: files[0],
      },
      {
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
      },
    );
  };

  const formFields: FormFieldProps<CategorySelectSchema>[] = [
    {
      control,
      label: "Type",
      name: "type",
      placeholder: "Select Type of category",
      component: "select",
      options: [
        { label: "Business", value: 1 },
        { label: "Hire", value: 2 },
      ],
      error: errors.type?.message,
    },
    {
      control,
      label: "Title",
      name: "title",
      placeholder: "eg: garment",
      component: "input",
    },
    {
      control,
      label: "Photo",
      name: "photo",
      component: "image",
      error: "",
    },
    {
      control,
      label: "Active",
      name: "status",
      mainDivClassName: "flex gap-4",
      placeholder: "",
      component: "single-checkbox",
    },
    {
      control,
      label: "isPopular",
      name: "isPopular",
      mainDivClassName: "flex gap-4",
      placeholder: "",
      component: "single-checkbox",
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

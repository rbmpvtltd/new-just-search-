"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryInsertSchema } from "@repo/db/dist/schema/not-related.schema";
import { useMutation } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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

const extendedCategoryInsertSchema = categoryInsertSchema
  .pick({
    photo: true,
    isPopular: true,
    type: true,
    title: true,
    status: true,
  })
  .extend({
    photo: z.any(),
  });

type CategorySelectSchema = z.infer<typeof extendedCategoryInsertSchema>;

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
    trpc.adminCategoryRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategorySelectSchema>({
    resolver: zodResolver(extendedCategoryInsertSchema),
    defaultValues: {
      photo: "",
      type: 1,
      status: false,
      isPopular: false,
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

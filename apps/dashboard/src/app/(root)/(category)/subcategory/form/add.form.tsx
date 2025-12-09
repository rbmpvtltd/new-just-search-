"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { subcategoryInsertSchema } from "@repo/db/dist/schema/not-related.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
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

type SubCategorySelectSchema = z.infer<typeof subcategoryInsertSchema>;

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

  const { data: category } = useQuery(
    trpc.adminSubcategoryRouter.add.queryOptions(),
  );
  const { mutate: create } = useMutation(
    trpc.adminCategoryRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubCategorySelectSchema>({
    resolver: zodResolver(subcategoryInsertSchema),
    defaultValues: {
      categoryId: NaN,
      name: "",
      status: false,
    },
  });

  const onSubmit = async (data: SubCategorySelectSchema) => {
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

  const formFields: FormFieldProps<SubCategorySelectSchema>[] = [
    {
      control,
      label: "Name",
      name: "name",
      placeholder: "eg: name",
      component: "input",
      error: errors.name?.message,
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
      label: "category",
      name: "categoryId",
      placeholder: "",
      options: [],
      component: "select",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SheetHeader>
        <SheetTitle>Add</SheetTitle>
      </SheetHeader>
      <div className="grid grid-cols-1 gap-6 px-4 ">
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

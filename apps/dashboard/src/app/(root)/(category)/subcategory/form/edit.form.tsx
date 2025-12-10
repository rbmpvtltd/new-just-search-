"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { subcategoryupdateschema } from "@repo/db/dist/schema/not-related.schema";
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

type SubCategoryUpdateSchema = z.infer<typeof subcategoryupdateschema>;

export function EditEntiry({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Edit Entry</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px]">
        <Suspense fallback={<div> loading ...</div>}>
          {open && <EditForm id={id} setOpen={setOpen} />}
        </Suspense>
      </SheetContent>
    </Sheet>
  );
}

interface EditForm {
  id: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
function EditForm({ id, setOpen }: EditForm) {
  const trpc = useTRPC();

  const { data } = useSuspenseQuery(
    trpc.adminSubcategoryRouter.edit.queryOptions(id),
  );
  const { mutate: create } = useMutation(
    trpc.adminSubcategoryRouter.update.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SubCategoryUpdateSchema>({
    resolver: zodResolver(subcategoryupdateschema),
    defaultValues: {
      id: id,
      categoryId: data?.data?.categoryId,
      name: data?.data?.name,
      status: data?.data?.status,
    },
  });

  const onSubmit = async (data: SubCategoryUpdateSchema) => {
    create(data, {
      onSuccess: () => {
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({
          queryKey: trpc.adminSubcategoryRouter.list.queryKey(),
        });
        queryClient.invalidateQueries({
          queryKey: trpc.adminSubcategoryRouter.edit.queryKey(),
        });
        setOpen(false);
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  const formFields: FormFieldProps<SubCategoryUpdateSchema>[] = [
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
      options:
        data?.categories.map((item) => ({
          label: item.title,
          value: item.id,
        })) ?? [],
      component: "select",
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SheetHeader>
        <SheetTitle>Edit</SheetTitle>
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

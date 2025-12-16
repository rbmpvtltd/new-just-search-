"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanPeriod, UserRole } from "@repo/db/dist/enum/allEnum.enum";
import {
  planAttributesInsertSchema,
  plansInsertSchema,
} from "@repo/db/dist/schema/plan.schema";
import { useMutation } from "@tanstack/react-query";
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

type PlansAttributesInsertSchema = z.infer<typeof planAttributesInsertSchema>;

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
    trpc.adminAttributesRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlansAttributesInsertSchema>({
    resolver: zodResolver(planAttributesInsertSchema),
    defaultValues: {
      name: "",
      planId: NaN,
      isAvailable: false,
    },
  });

  console.log("errors", errors);

  const onSubmit = async (data: PlansAttributesInsertSchema) => {
    create(data, {
      onSuccess: () => {
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({
          queryKey: trpc.adminAttributesRouter.list.queryKey(),
        });
        setOpen(false);
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  const formFields: FormFieldProps<PlansAttributesInsertSchema>[] = [
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
      label: "Plan Name",
      name: "planId",
      type: "number",
      placeholder: "0",
      component: "select",
      options: [
        {
          value: 1,
          label: "PRO",
        },
        {
          value: 2,
          label: "FREE",
        },
        {
          value: 3,
          label: "ULTRA",
        },
        {
          value: 4,
          label: "HIRE",
        },
      ],
      error: errors.planId?.message,
    },
    {
      control,
      label: "Is Available",
      name: "isAvailable",
      placeholder: "false",
      component: "single-checkbox",
      error: errors.isAvailable?.message,
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

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlanPeriod, UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { plansInsertSchema } from "@repo/db/dist/schema/plan.schema";
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

type PlansSelectSchema = z.infer<typeof plansInsertSchema>;

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

  // const { data: category } = useQuery(
  //   trpc.adminSubcategoryRouter.add.queryOptions(),
  // );
  const { mutate: create } = useMutation(
    trpc.adminPlanRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PlansSelectSchema>({
    resolver: zodResolver(plansInsertSchema),
    defaultValues: {
      status: true,
      amount: 0,
      interval: 0,
      maxOfferPerDay: 0,
      offerDuration: 0,
      offerLimit: 0,
      productLimit: 0,
      verifyBag: false,
      role: "guest",
      planColor: "#000000",
      name: "",
      period: "monthly",
    },
  });

  console.log("errors", errors);

  const onSubmit = async (data: PlansSelectSchema) => {
    create(data, {
      onSuccess: () => {
        const queryClient = getQueryClient();
        queryClient.invalidateQueries({
          queryKey: trpc.adminSubcategoryRouter.list.queryKey(),
        });
        setOpen(false);
      },
      onError: (e) => {
        console.error(e);
      },
    });
  };

  const formFields: FormFieldProps<PlansSelectSchema>[] = [
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
      error: errors.status?.message,
    },
    {
      control,
      label: "Amount",
      name: "amount",
      type: "number",
      placeholder: "0",
      component: "input",
      error: errors.amount?.message,
    },
    {
      control,
      label: "Interval",
      type: "number",
      name: "interval",
      placeholder: "0",
      component: "input",
      error: errors.interval?.message,
    },
    {
      control,
      label: "Role",
      name: "role",
      placeholder: "guest",
      component: "select",
      error: errors.role?.message,
      options: Object.values(UserRole).map((item) => ({
        label: item,
        value: item,
      })),
    },
    {
      control,
      label: "Period",
      name: "period",
      placeholder: "month",
      component: "select",
      error: errors.period?.message,
      options: Object.values(PlanPeriod).map((item) => ({
        label: item,
        value: item,
      })),
    },
    {
      control,
      label: "Color",
      name: "planColor",
      placeholder: "#000000",
      component: "input",
      error: errors.planColor?.message,
    },
    {
      control,
      label: "Product Limit",
      name: "productLimit",
      type: "number",
      placeholder: "0",
      component: "input",
      error: errors.productLimit?.message,
    },
    {
      control,
      label: "Offer Limit",
      name: "offerLimit",
      type: "number",
      placeholder: "0",
      component: "input",
      error: errors.offerLimit?.message,
    },
    {
      control,
      label: "Offer Duration",
      type: "number",
      name: "offerDuration",
      placeholder: "0",
      component: "input",
      error: errors.offerDuration?.message,
    },
    {
      control,
      label: "Max Offer Per Day",
      name: "maxOfferPerDay",
      type: "number",
      placeholder: "0",
      component: "input",
      error: errors.maxOfferPerDay?.message,
    },
    {
      control,
      label: "Verify Bag",
      name: "verifyBag",
      placeholder: "false",
      component: "single-checkbox",
      error: errors.verifyBag?.message,
    },
  ];

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <SheetHeader>
        <SheetTitle>Add</SheetTitle>
      </SheetHeader>
      <div className="grid grid-cols-1 gap-6 px-4 flex-1 h-[calc(100vh-200px)] overflow-y-scroll">
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

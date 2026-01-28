"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { UserRole } from "@repo/db/dist/enum/allEnum.enum";
import { notificationInsertSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, Suspense, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
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
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";

type AddData = OutputTrpcType["adminNotificationRouter"]["add"];
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
        {open && (
          <Suspense fallback={<div> loading ...</div>}>
            <GetData setOpen={setOpen} />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface AddForm {
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: AddData;
}

function GetData({ setOpen }: { setOpen: Dispatch<SetStateAction<boolean>> }) {
  const trpc = useTRPC();

  const { data, isFetching } = useSuspenseQuery(
    trpc.adminNotificationRouter.add.queryOptions(undefined, {
      staleTime: 0,
    }),
  );

  if (isFetching) return <Spinner />;

  return <AddForm setOpen={setOpen} data={data} />;
}

function AddForm({ setOpen, data }: AddForm) {
  const trpc = useTRPC();

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
      city: [],
      notificationId: data.newNotificationId,
      state: [],
      role: [],
      status: true,
      categoryId: [],
      subCategoryId: [],
    },
  });

  const selectedCategoryId = useWatch({ control, name: "categoryId" }) ?? [];
  const { data: subCategories, isLoading: subCategoriesLoading } = useQuery(
    trpc.utilsRouter.getSubCategories.queryOptions(selectedCategoryId),
  );

  const selectedStateIds = useWatch({ control, name: "state" }) ?? [];
  const { data: cities, isLoading: citiesLoading } = useQuery(
    trpc.utilsRouter.getCities.queryOptions(selectedStateIds),
  );

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
        { label: UserRole.visitor, value: UserRole.visitor },
      ],
      error: errors.role?.message,
    },
    {
      control,
      label: "Category",
      name: "categoryId",
      placeholder: "Category",
      component: "multiselect",
      options:
        data.category?.map((item) => ({ label: item.name, value: item.id })) ??
        [],
      error: errors.categoryId?.message,
    },
    {
      control,
      label: "Sub Category",
      name: "subCategoryId",
      placeholder: "Sub category",
      component: "multiselect",
      loading: subCategoriesLoading,
      options:
        subCategories?.map((item) => ({ label: item.name, value: item.id })) ??
        [],
      error: errors.subCategoryId?.message,
    },
    {
      control,
      label: "State",
      name: "state",
      placeholder: "State",
      component: "multiselect",
      options:
        data.state?.map((item) => ({ label: item.name, value: item.id })) ?? [],
      error: errors.state?.message,
    },
    {
      control,
      label: "City",
      name: "city",
      placeholder: "City",
      component: "multiselect",
      loading: citiesLoading,
      options:
        cities?.map((item) => ({ label: item.name, value: item.id })) ?? [],
      error: errors.city?.message,
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
    <form className="overflow-y-scroll" onSubmit={handleSubmit(onSubmit)}>
      <SheetHeader>
        <div>{data.newNotificationId}</div>
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

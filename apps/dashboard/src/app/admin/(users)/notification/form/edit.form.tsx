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

type EditData = OutputTrpcType["adminNotificationRouter"]["edit"];
const extendedInsertSchema = notificationInsertSchema;

type SelectSchema = z.infer<typeof extendedInsertSchema>;

export function EditEntiry({ notificationId }: { notificationId: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Sheet onOpenChange={setOpen} open={open}>
      <SheetTrigger asChild>
        <Button>Edit Entiry</Button>
      </SheetTrigger>
      <SheetContent className="sm:max-w-[425px] p-4">
        {open && (
          <Suspense fallback={<div> loading ...</div>}>
            <GetData setOpen={setOpen} id={notificationId} />
          </Suspense>
        )}
      </SheetContent>
    </Sheet>
  );
}

interface EditForm {
  setOpen: Dispatch<SetStateAction<boolean>>;
  data: EditData;
}

function GetData({
  setOpen,
  id,
}: {
  setOpen: Dispatch<SetStateAction<boolean>>;
  id: number;
}) {
  const trpc = useTRPC();

  const { data, isFetching } = useSuspenseQuery(
    trpc.adminNotificationRouter.edit.queryOptions(
      {
        id,
      },
      {
        staleTime: 0,
      },
    ),
  );

  if (isFetching) return <Spinner />;

  return <EditForm setOpen={setOpen} data={data} />;
}

function EditForm({ setOpen, data }: EditForm) {
  const trpc = useTRPC();

  const { mutate: update } = useMutation(
    trpc.adminNotificationRouter.update.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SelectSchema>({
    resolver: zodResolver(extendedInsertSchema),
    defaultValues: {
      description: data.lastData?.description,
      title: data.lastData?.title,
      city: data.lastData?.cities,
      notificationId: data.lastData?.notificationId,
      state: data.lastData?.states,
      role: data.lastData?.role,
      status: true,
      categoryId: data.lastData?.category,
      subCategoryId: data.lastData?.subcategories,
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
    update(data, {
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
        <div>{data.lastData?.notificationId}</div>
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

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { categoryInsertSchema } from "@repo/db/src/schema/not-related.schema";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
import { type Dispatch, type SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import BoundaryWrapper from "@/components/layout/BoundaryWrapper";
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

const extendedCategoryInsertSchema = categoryInsertSchema
  .pick({
    id: true,
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

export function EditBanner({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <BoundaryWrapper>
          {open && <BannerEditForm id={id} setOpen={setOpen} />}
        </BoundaryWrapper>
      </DialogContent>
    </Dialog>
  );
}

interface EditForm {
  id: number;
  setOpen: Dispatch<SetStateAction<boolean>>;
}
function BannerEditForm({ id, setOpen }: EditForm) {
  const trpc = useTRPC();

  const { data, refetch } = useSuspenseQuery(
    trpc.adminCategoryRouter.edit.queryOptions({ id }),
  );

  const { mutate: update } = useMutation(
    trpc.adminCategoryRouter.update.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CategorySelectSchema>({
    resolver: zodResolver(extendedCategoryInsertSchema),
    defaultValues: {
      id: data?.id,
      photo: data?.photo,
      title: data?.title,
      type: data?.type,
      status: data?.status,
      isPopular: data?.isPopular,
    },
  });

  const onSubmit = async (data: CategorySelectSchema) => {
    console.log("submiting started");
    const files = await uploadToCloudinary([data.photo], "banner");
    if (!files || !files[0]) {
      console.log("files", files);
      console.error("file uploading to cloudinary failed");
      return;
    }
    console.log("data is", data);
    update(
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
          refetch();
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
      label: "",
      name: "id",
      placeholder: "idis",
      type: "hidden",
      component: "input",
      required: false,
    },
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
      required: false,
      // error: errors.photo?.message,
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
        <DialogTitle>Edit</DialogTitle>
      </DialogHeader>
      <div className="grid grid-cols-1 gap-6">
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

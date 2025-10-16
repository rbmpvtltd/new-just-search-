"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { bannerInsertSchema } from "@repo/db/src/schema/not-related.schema";
import { useMutation, useSuspenseQuery } from "@tanstack/react-query";
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

// import { bannerSelectSchema } from "@repo/db/src/schema/not-related.schema";

const extendedBannerSelectSchema = bannerInsertSchema
  .pick({
    id: true,
    isActive: true,
    photo: true,
    route: true,
    type: true,
  })
  .extend({
    photo: z.any(),
    isActive: z.number(),
  });

type BannerSelectSchema = z.infer<typeof extendedBannerSelectSchema>;

export function EditBanner({ id }: { id: number }) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button>Edit</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <Suspense fallback={<div> loading ...</div>}>
          {open && <BannerEditForm id={id} setOpen={setOpen} />}
        </Suspense>
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
    trpc.adminBanner.edit.queryOptions({ id }),
  );

  const { mutate: updateBanner } = useMutation(
    trpc.adminBanner.update.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BannerSelectSchema>({
    resolver: zodResolver(extendedBannerSelectSchema),
    defaultValues: {
      id: data?.id,
      photo: data?.photo,
      type: data?.type,
      isActive: data?.isActive ? 1 : 0,
      route: data?.route,
    },
  });

  const onSubmit = async (data: BannerSelectSchema) => {
    console.log("submiting started");
    const files = await uploadToCloudinary([data.photo],"banner","");
    if (!files || !files[0]) {
      console.log("files", files);
      console.error("file uploading to cloudinary failed");
      return;
    }
    console.log("data is", data);
    updateBanner(
      {
        ...data,
        isActive: data.isActive === 1,
        photo: files[0],
      },
      {
        onSuccess: () => {
          const queryClient = getQueryClient();
          queryClient.invalidateQueries({
            queryKey: trpc.adminBanner.list.queryKey(),
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

  const formFields: FormFieldProps<BannerSelectSchema>[] = [
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
      placeholder: "Select Type of banner",
      component: "select",
      options: [
        { label: "Banner 1", value: 1 },
        { label: "Banner 2", value: 2 },
        { label: "Banner 3", value: 3 },
        { label: "Banner 4", value: 4 },
      ],
      error: errors.type?.message,
    },
    {
      control,
      label: "Redirect Route",
      name: "route",
      placeholder: "/business/vastrakala",
      component: "input",
      required: false,
    },
    {
      control,
      label: "Photo",
      name: "photo",
      placeholder: "",
      component: "image",
      required: false,
      error: "",
    },
    {
      control,
      label: "Active",
      name: "isActive",
      placeholder: "",
      component: "select",
      options: [
        { label: "True", value: 1 },
        { label: "False", value: 0 },
      ],
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

"use client";
import { useMutation } from "@tanstack/react-query";

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
import type { schemas } from "@repo/db";

export type BannerSchema = z.infer<
  typeof schemas.not_related.bannerSelectSchema
>;

// NOTE: explain differnent between select schema and insert schema

export function AddBanner() {
  const trpc = useTRPC();

  const { mutate } = useMutation(trpc.adminBanner.add.mutationOptions());

  const { control, handleSubmit } = useForm<BannerSchema>();

  const onSubmit = async (data: BannerSchema) => {
    const files = await uploadToCloudinary([data.photo]);
    console.log(files);
  };

  const formFields: FormFieldProps<BannerSchema>[] = [
    {
      control,
      label: "Type",
      name: "type",
      placeholder: "Select Type of banner",
      component: "select",
      options: [
        { label: "Banner 1", value: "1" },
        { label: "Banner 2", value: "2" },
        { label: "Banner 3", value: "3" },
        { label: "Banner 4", value: "4" },
      ],
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
        { label: "True", value: "1" },
        { label: "False", value: "2" },
      ],
    },
  ];
  return (
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button
            onClick={() => {
              mutate();
            }}
          >
            Add Banner
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Banner</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-1 gap-6">
            {formFields.map((field) => (
              <FormField key={field.name} {...field} />
            ))}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button onClick={handleSubmit(onSubmit)} type="submit">
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}

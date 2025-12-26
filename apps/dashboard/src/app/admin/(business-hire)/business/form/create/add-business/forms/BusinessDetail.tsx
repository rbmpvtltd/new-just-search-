"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { useBusinessFormStore } from "../../../shared/store/useCreateBusinessStore";
import type { AddBusinessPageType } from "..";

export const adminBusinessDetailSchema = businessDetailSchema.extend({
  userId: z.number(),
});

type BusinessDetailSchema = z.infer<typeof adminBusinessDetailSchema>;
export default function BusinessDetail({
  data,
}: {
  data: AddBusinessPageType;
}) {
  const trpc = useTRPC();
  const formValue = useBusinessFormStore((state) => state.formValue);
  const setFormValue = useBusinessFormStore((state) => state.setFormValue);
  const nextPage = useBusinessFormStore((state) => state.nextPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailSchema>({
    resolver: zodResolver(adminBusinessDetailSchema),
    defaultValues: {
      userId: formValue.userId ?? "",
      photo: formValue.photo ?? "",
      name: formValue.name ?? "",
      categoryId: formValue.categoryId ?? "",
      subcategoryId: formValue.subcategoryId ?? "",
      specialities: formValue.specialities ?? "",
      homeDelivery: formValue.homeDelivery ?? "",
      description: formValue.description ?? "",
      image1: formValue.image1 ?? "",
      image2: formValue.image2 ?? "",
      image3: formValue.image3 ?? "",
      image4: formValue.image4 ?? "",
      image5: formValue.image5 ?? "",
    },
  });

  const categories = data?.getBusinessCategories.map((item) => {
    return {
      label: item.title,
      value: item.id,
    };
  });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const { data: subCategories, isLoading } = useQuery(
    trpc.adminBusinessRouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );

  const formFields: FormFieldProps<BusinessDetailSchema>[] = [
    {
      control,
      label: "Business image",
      name: "photo",
      placeholder: "Business Image",
      component: "image",
      error: errors.photo?.message,
    },
    {
      control,
      label: "User",
      name: "userId",
      placeholder: "User name",
      component: "select",
      options:
        data?.users?.map((item) => ({
          label: ` ${item.displayName ?? "unknown"}  , id  ${item.id}`,
          value: item.id,
        })) ?? [],
      error: errors.userId?.message,
    },
    {
      control,
      label: "Business Name",
      name: "name",
      placeholder: "Business Name",
      component: "input",
      error: errors.name?.message,
    },
    {
      control,
      label: "Category",
      name: "categoryId",
      placeholder: "Category",
      component: "select",
      options:
        categories?.map((item) => ({ label: item.label, value: item.value })) ??
        [],
      error: errors.categoryId?.message,
    },
    {
      control,
      label: "Sub Category",
      name: "subcategoryId",
      placeholder: "Sub Category",
      component: "multiselect",
      loading: isLoading,
      options:
        subCategories?.map((item) => ({
          label: item.name,
          value: item.id,
        })) ?? [],
      error: errors.subcategoryId?.message,
    },
    {
      control,
      label: "Specialities",
      name: "specialities",
      placeholder: "Specialities",
      component: "input",
      required: false,
      error: errors.specialities?.message,
    },
    {
      control,
      label: "Home Delivery",
      name: "homeDelivery",
      placeholder: "Home Delivery",
      component: "select",
      options: [
        { label: "Yes", value: "yes" },
        { label: "No", value: "no" },
      ],
      required: false,
      error: errors.homeDelivery?.message,
    },
    {
      control,
      label: "About Business",
      name: "description",
      placeholder: "About Business",
      component: "editor",
      required: false,
      error: errors.description?.message,
    },
  ];

  const formFields2: FormFieldProps<BusinessDetailSchema>[] = [
    {
      control,
      type: "",
      name: "image1",
      component: "image",
      required: false,
      error: errors.image1?.message,
    },
    {
      control,
      type: "",
      name: "image2",
      component: "image",
      className: "mt-5",
      required: false,
      error: errors.image2?.message,
    },
    {
      control,
      type: "",
      name: "image3",
      component: "image",
      required: false,
      error: errors.image3?.message,
    },
    {
      control,
      type: "",
      name: "image4",
      component: "image",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
      type: "",
      name: "image5",
      component: "image",
      required: false,
      error: errors.image5?.message,
    },
  ];

  const onSubmit = async (data: BusinessDetailSchema) => {
    const file = await uploadToCloudinary(
      [
        data.photo,
        data.image1,
        data.image2,
        data.image3,
        data.image4,
        data.image5,
      ],
      "business",
    );
    setFormValue("photo", file[0] ?? "");
    setFormValue("userId", data.userId ?? NaN);
    setFormValue("name", data.name ?? "");
    setFormValue("categoryId", data.categoryId ?? "");
    setFormValue("subcategoryId", data.subcategoryId ?? []);
    setFormValue("specialities", data.specialities ?? "");
    setFormValue("homeDelivery", data.homeDelivery ?? "");
    setFormValue("description", data.description ?? "");
    setFormValue("image1", file[1] ?? "");
    setFormValue("image2", file[2] ?? "");
    setFormValue("image3", file[3] ?? "");
    setFormValue("image4", file[4] ?? "");
    setFormValue("image5", file[5] ?? "");
    nextPage();
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className=" max-w-6xl ">
        <div className="p-8 space-y-8 ">
          <div className="p-6 shadow rounded-xl bg-gray-50 border ">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.name === "description" ? "col-span-full" : ""
                  }
                >
                  <FormField {...field} />
                </div>
              ))}
            </div>
            <Label className="mt-3 gap-0 ">
              Shop Images
              <span className="text-red-500 ">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
              {formFields2.map((field) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            {isSubmitting ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              "CONTINUE"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

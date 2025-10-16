"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailSchema } from "@repo/db/src/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { Button } from "@/components/ui/button";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { useTRPC } from "@/trpc/client";
import type { AddBusinessPageType } from "..";

type BusinessDetailSchema = z.infer<typeof businessDetailSchema>;
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
    formState: { errors },
  } = useForm<BusinessDetailSchema>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      photo: formValue.photo ?? "",
      name: formValue.name ?? "",
      categoryId: formValue.categoryId ?? "",
      subcategoryId: formValue.subcategoryId ?? "",
      specialities: formValue.specialities ?? "",
      homeDelivery: formValue.homeDelivery ?? false,
      description: formValue.description ?? "",
    },
  });

  const categories = data?.getBusinessCategories.map((item: any) => {
    return {
      label: item.title,
      value: item.id,
    };
  });
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const { data: subCategories, isLoading } = useQuery(
    trpc.businessrouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );
  if (isLoading) {
    return <div className="">Loading...</div>;
  }

  const formFields: FormFieldProps<BusinessDetailSchema>[] = [
    {
      control,
      label: "Business image",
      name: "photo",
      placeholder: "Business Image",
      component: "input",
      error: errors.photo?.message,
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
        { label: "Yes", value: true },
        { label: "No", value: false },
      ],
      required: false,
      error: errors.homeDelivery?.message,
    },
    {
      control,
      label: "About Business",
      name: "description",
      placeholder: "About Business",
      component: "textarea",
      required: false,
      error: errors.description?.message,
    },
    // {
    //   control,
    //   type: "",
    //   label: "Shop Images",
    //   name: "",
    //   component: "input",
    //   required: false,
    //   error: "",
    // },
    // {
    //   control,
    //   type: "",
    //   label: "",
    //   name: "shopImage2",
    //   component: "input",
    //   className: "mt-5",
    //   required: false,
    //   error: "",
    // },
    // {
    //   control,
    //   type: "",
    //   label: "",
    //   name: "shopImage3",
    //   component: "input",
    //   required: false,
    //   error: "",
    // },
    // {
    //   control,
    //   type: "",
    //   label: "",
    //   name: "shopImage4",
    //   component: "input",
    //   required: false,
    //   error: "",
    // },
    // {
    //   control,
    //   type: "",
    //   label: "",
    //   name: "shopImage5",
    //   component: "input",
    //   required: false,
    //   error: "",
    // },
  ];

  const onSubmit = (data: BusinessDetailSchema) => {
    console.log(data);
    setFormValue("photo", data.photo ?? ""),
      setFormValue("name", data.name ?? ""),
      setFormValue("categoryId", data.categoryId ?? ""),
      setFormValue("subcategoryId", data.subcategoryId ?? []),
      setFormValue("specialities", data.specialities ?? ""),
      setFormValue("homeDelivery", data.homeDelivery ?? ""),
      setFormValue("description", data.description ?? "");
    nextPage();
  };
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-xl mx-auto rounded-xl max-w-4xl bg-white"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Contact
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-3">
              {formFields.map((field, index) => (
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
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            SUBMIT
          </Button>
        </div>
      </form>
    </div>
  );
}

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
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { useTRPC } from "@/trpc/client";
import type { FormReferenceDataType, UserBusinessListingType } from "..";

type BusinessDetailSchema = z.infer<typeof businessDetailSchema>;
export default function BusinessDetail({
  businessListing,
  formReferenceData,
}: {
  businessListing: UserBusinessListingType;
  formReferenceData: FormReferenceDataType;
}) {
  const trpc = useTRPC();
  const setFormValue = useBusinessFormStore((state) => state.setFormValue);
  const nextPage = useBusinessFormStore((state) => state.nextPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailSchema>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      photo: businessListing?.photo,
      name: businessListing?.name,
      categoryId: businessListing?.category.id,
      subcategoryId: businessListing?.subcategory?.map((item) => item.id),
      specialities: businessListing?.specialities ?? "",
      homeDelivery: businessListing?.homeDelivery ?? false,
      description: businessListing?.description ?? "",
    },
  });

  const categories = formReferenceData?.getBusinessCategories.map(
    (item: any) => {
      return {
        label: item.title,
        value: item.id,
      };
    },
  );
  const selectedCategoryId = useWatch({ control, name: "categoryId" });
  const { data: subCategories, isLoading } = useQuery(
    trpc.businessrouter.getSubCategories.queryOptions({
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
      label: "Business Name",
      name: "name",
      placeholder: "Business Name",
      disabled: true,
      component: "input",
      error: errors.name?.message,
    },
    {
      control,
      label: "Category",
      name: "categoryId",
      placeholder: "Category",
      component: "select",
      disabled: true,
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

  const onSubmit = async (data: BusinessDetailSchema) => {
    const file = await uploadToCloudinary([data.photo], "business");
    setFormValue("photo", file[0] ?? "");
    setFormValue("name", data.name ?? "");
    setFormValue("categoryId", data.categoryId ?? "");
    setFormValue("subcategoryId", data.subcategoryId ?? []);
    setFormValue("specialities", data.specialities ?? "");
    setFormValue("homeDelivery", data.homeDelivery ?? "");
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

"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { useTRPC } from "@/trpc/client";
import type { UserBusinessListingType } from "..";

type BusinessDetailSchema = z.infer<typeof businessDetailSchema>;
export default function BusinessDetail({
  businessListing,
}: {
  businessListing: UserBusinessListingType;
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
      photo: businessListing?.business?.photo,
      name: businessListing?.business?.name,
      categoryId: businessListing?.category?.categoryId,
      subcategoryId: businessListing?.subcategories.map(
        (item) => item.subcategoryId,
      ),
      specialities: businessListing?.business?.specialities ?? "",
      homeDelivery: businessListing?.business?.homeDelivery ?? "",
      description: businessListing?.business?.description ?? "",
      image1: businessListing?.businessPhotos[0]?.photo ?? "",
      image2: businessListing?.businessPhotos[1]?.photo ?? "",
      image3: businessListing?.businessPhotos[2]?.photo ?? "",
      image4: businessListing?.businessPhotos[3]?.photo ?? "",
      image5: businessListing?.businessPhotos[4]?.photo ?? "",
    },
  });

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
        businessListing?.getBusinessCategories?.map((item) => ({
          label: item.title,
          value: item.id,
        })) ?? [],
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
      component: "editor",
      required: false,
      error: errors.description?.message,
    },
  ];

  const formFields2: FormFieldProps<BusinessDetailSchema>[] = [
    {
      control,
      type: "",
      label: "Shop Images",
      name: "image1",
      component: "image",
      required: false,
      error: "",
    },
    {
      control,
      type: "",
      label: "",
      name: "image2",
      component: "image",
      className: "mt-5",
      required: false,
      error: "",
    },
    {
      control,
      type: "",
      label: "",
      name: "image3",
      component: "image",
      required: false,
      error: "",
    },
    {
      control,
      type: "",
      label: "",
      name: "image4",
      component: "image",
      required: false,
      error: "",
    },
    {
      control,
      type: "",
      label: "",
      name: "image5",
      component: "image",
      className: "align-center",
      required: false,
      error: "",
    },
  ];

  const onSubmit = async (data: BusinessDetailSchema) => {
    const files = await uploadToCloudinary(
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

    setFormValue("photo", files[0] ?? "");
    setFormValue("name", data.name ?? "");
    setFormValue("categoryId", data.categoryId ?? "");
    setFormValue("subcategoryId", data.subcategoryId ?? []);
    setFormValue("specialities", data.specialities ?? "");
    setFormValue("homeDelivery", data.homeDelivery ?? "");
    setFormValue("description", data.description ?? "");
    setFormValue("image1", files[1] ?? "");
    setFormValue("image2", files[2] ?? "");
    setFormValue("image3", files[3] ?? "");
    setFormValue("image4", files[4] ?? "");
    setFormValue("image5", files[5] ?? "");
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
              Business Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-3">
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
              {/* <span className="text-red-500 ">*</span> */}
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-3 gap-6 mt-3 justify-items-center">
              {formFields2.map((field) => (
                <FormField labelHidden key={field.name} {...field} />
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

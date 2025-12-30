"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { offersUpdateSchema } from "@repo/db/dist/schema/offer.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";
import type { SetOpen } from "../edit.form";

type EditOfferSchema = z.infer<typeof offersUpdateSchema>;

type EditAdminOfferType = OutputTrpcType["adminOfferRouter"]["edit"] | null;
export default function EditOffer({
  data,
  setOpen,
}: {
  data: EditAdminOfferType;
  setOpen: SetOpen;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminOfferRouter.update.mutationOptions(),
  );
  const categories = data?.getBusinessCategories;
  const subCategories = data?.getSubCategories;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditOfferSchema>({
    resolver: zodResolver(offersUpdateSchema),
    defaultValues: {
      businessId: data?.offer.businessId,
      offerName: data?.offer.offerName,
      rate: data?.offer?.rate,
      discountPercent: data?.offer?.discountPercent,
      finalPrice: data?.offer?.finalPrice,
      offerDescription: data?.offer?.offerDescription,
      mainImage: data?.offer.mainImage || "",
      image2: data?.offerPhotos[1]?.photo || "",
      image3: data?.offerPhotos[2]?.photo || "",
      image4: data?.offerPhotos[3]?.photo || "",
      image5: data?.offerPhotos[4]?.photo || "",
      categoryId: data?.offer.categoryId,
      subcategoryId: data?.offer.offerSubcategory.map(
        (item) => item.subcategoryId,
      ),
    },
  });

  const formFields: FormFieldProps<EditOfferSchema>[] = [
    {
      control,
      label: "Business Name",
      name: "businessId",
      placeholder: "Business name",
      component: "select",
      options:
        data?.allBusinessListings?.map((item) => ({
          label: ` ${item.name ?? "unknown"}  , id  ${item.id}`,
          value: item.id,
        })) ?? [],
      error: errors.businessId?.message,
    },
    {
      control,
      label: "Product Name",
      name: "offerName",
      placeholder: "Product Name",
      component: "input",
      error: errors.offerName?.message,
    },
    {
      control,
      label: "Rate",
      name: "rate",
      placeholder: "Rate",
      type: "number",
      component: "input",
      error: errors.rate?.message,
    },
    {
      control,
      label: "Discount Percent",
      name: "discountPercent",
      placeholder: "Discount Percent",
      component: "input",
      type: "number",
      error: errors.discountPercent?.message,
    },
    {
      control,
      label: "Final Price",
      name: "finalPrice",
      placeholder: "Final Price",
      component: "input",
      type: "number",
      error: errors.finalPrice?.message,
    },
    {
      control,
      label: "Category",
      name: "categoryId",
      placeholder: "Category",
      component: "select",
      options:
        categories?.map((item) => ({ label: item.title, value: item.id })) ??
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
      label: "Description",
      name: "offerDescription",
      placeholder: "Description",
      component: "editor",
      error: errors.offerDescription?.message,
    },
  ];

  const formFields2: FormFieldProps<EditOfferSchema>[] = [
    {
      control,
      name: "mainImage",
      component: "image",
      error: errors.mainImage?.message,
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
  const onSubmit = async (data: EditOfferSchema) => {
    const file = await uploadToCloudinary(
      [data.mainImage, data.image2, data.image3, data.image4, data.image5],
      "offers",
    );
    mutate(
      {
        ...data,
        mainImage: file[0] ?? "",
        image2: file[1] ?? "",
        image3: file[2] ?? "",
        image4: file[3] ?? "",
        image5: file[4] ?? "",
        businessId: Number(data?.businessId) ?? "",
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast("success", {
              description: data.message,
            });
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
              queryKey: trpc.adminOfferRouter.list.queryKey(),
            });
            setOpen(false);
          }
        },
        onError: (error) => {
          if (isTRPCClientError(error)) {
            toast.error("Error", {
              description: error.message,
            });
            console.error("error,", error.message);
          }
        },
      },
    );
  };
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-xl mx-auto rounded-xl max-w-4xl bg-white"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mt-3">
              {formFields.map((field) => (
                <div
                  key={field.name}
                  className={
                    field.name === "offerDescription" ? "col-span-full" : ""
                  }
                >
                  <FormField {...field} />
                </div>
              ))}
            </div>
            <Label className="mt-3 gap-0 ">
              Offer Images
              <span className="text-red-500 ">*</span>
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 mt-3">
              {formFields2.map((field, index) => (
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
              "SUBMIT"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

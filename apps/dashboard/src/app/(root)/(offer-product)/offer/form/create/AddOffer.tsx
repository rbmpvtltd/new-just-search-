"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { offersInsertSchema } from "@repo/db/dist/schema/offer.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "sonner";
import Swal from "sweetalert2";
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
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";
import type { SetOpen } from "../add.form";

const adminAddOfferSchema = offersInsertSchema.extend({
  businessName: z.string().optional(),
});
type AddOfferSchema = z.infer<typeof adminAddOfferSchema>;
type AddAdminOfferType = OutputTrpcType["adminOfferRouter"]["add"];
export default function AddOffer({
  setOpen,
  data,
}: {
  setOpen: SetOpen;
  data: AddAdminOfferType;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminOfferRouter.create.mutationOptions(),
  );

  const {
    control,
    setValue,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddOfferSchema>({
    resolver: zodResolver(offersInsertSchema),
    defaultValues: {
      businessName: "",
      offerName: "",
      rate: 0,
      discountPercent: 0,
      finalPrice: 0,
      offerDescription: "",
      mainImage: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      categoryId: 0,
      subcategoryId: [],
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
    trpc.adminOfferRouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );
  const formFields: FormFieldProps<AddOfferSchema>[] = [
    {
      control,
      label: "User",
      name: "businessName",
      placeholder: "Business name",
      component: "select",
      options:
        data?.users?.map((item) => ({
          label: ` ${item.displayName ?? "unknown"}  , id  ${item.id}`,
          value: item.id,
        })) ?? [],
      error: errors.businessName?.message,
    },
    {
      control,
      label: "Offer Name",
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
      onChangeValue: (value) => {
        if (!value) return;
        setValue("finalPrice", Number(value));
      },
      error: errors.rate?.message,
    },
    {
      control,
      label: "Discount Percent",
      name: "discountPercent",
      placeholder: "Discount Percent",
      component: "input",
      type: "number",
      onChangeValue: (value) => {
        if (!value) return;
        const discount = parseFloat(String(value));
        const price = parseFloat((getValues("rate") || 0).toString());
        const final = (price * (100 - discount)) / 100;

        setValue("discountPercent", discount);
        setValue("finalPrice", parseFloat(final.toFixed(2)));
      },
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
      label: "Description",
      name: "offerDescription",
      placeholder: "Description",
      component: "editor",
      error: errors.offerDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<AddOfferSchema>[] = [
    {
      control,
      name: "mainImage",
      component: "image",
      required: false,
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
  const onSubmit = async (data: AddOfferSchema) => {
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
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            toast("success", {
              description: data.message,
            });
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
              queryKey: trpc.offerrouter.showOffer.queryKey(),
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
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Add Offer
            </h2>

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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-3">
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
          <Button
            onClick={() => console.log(getValues())}
            type="button"
            className="bg-gray-500 hover:bg-gray-700 font-bold"
          >
            Get Values
          </Button>
        </div>
      </form>
    </div>
  );
}

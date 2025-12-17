"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { productInsertSchema } from "@repo/db/dist/schema/product.schema";
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
import type { SetOpen } from "../add.form";

type AddProductSchema = z.infer<typeof productInsertSchema>;

type AddAdminOfferType = OutputTrpcType["adminProductRouter"]["add"] | null;
export default function AddProduct({
  data,
  setOpen,
}: {
  data: AddAdminOfferType;
  setOpen: SetOpen;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.adminProductRouter.create.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProductSchema>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      businessId: NaN,
      productName: "",
      rate: 0,
      productDescription: "",
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
  const formFields: FormFieldProps<AddProductSchema>[] = [
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
      name: "productName",
      placeholder: "Product Name",
      component: "input",
      error: errors.productName?.message,
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
      name: "productDescription",
      placeholder: "Description",
      component: "editor",
      error: errors.productDescription?.message,
    },
  ];

  const formFields2: FormFieldProps<AddProductSchema>[] = [
    {
      control,
      // label: "Product Image",
      name: "mainImage",
      required: false,
      component: "image",
      error: errors.mainImage?.message,
    },
    {
      control,
      type: "",
      label: "dadasdad",
      name: "image2",
      component: "image",
      className: "mt-10",
      required: false,
      labelHidden: true,
      error: errors.image2?.message,
    },
    {
      control,
      type: "",
      // label: "",
      name: "image3",
      component: "image",
      required: false,
      error: errors.image3?.message,
    },
    {
      control,
      type: "",
      // label: "",
      name: "image4",
      component: "image",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
      type: "",
      // label: "",
      name: "image5",
      component: "image",
      required: false,

      error: errors.image5?.message,
    },
  ];

  const onSubmit = async (data: any) => {
    const file = await uploadToCloudinary(
      [data.mainImage, data.image2, data.image3, data.image4, data.image5],
      "products",
    );
    mutate(
      {
        ...data,
        mainImage: file[0],
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
              queryKey: trpc.adminProductRouter.list.queryKey(),
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
                    field.name === "productDescription" ? "col-span-full" : ""
                  }
                >
                  <FormField {...field} />
                </div>
              ))}
            </div>
            <Label className="mt-3 gap-0 ">
              Product Images
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
        </div>
      </form>
    </div>
  );
}

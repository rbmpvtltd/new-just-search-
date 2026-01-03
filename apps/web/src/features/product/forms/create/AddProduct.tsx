"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { productInsertSchema } from "@repo/db/dist/schema/product.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "next/navigation";
import { useForm, useWatch } from "react-hook-form";
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
import { sweetAlertError, sweetAlertSuccess } from "@/lib/sweetalert";
import { useTRPC } from "@/trpc/client";
import { getQueryClient } from "@/trpc/query-client";
import type { OutputTrpcType } from "@/trpc/type";

type AddProductSchema = z.infer<typeof productInsertSchema>;

type FormReferenceDataType = OutputTrpcType["productrouter"]["add"] | null;
export default function AddProduct({
  formReferenceData,
}: {
  formReferenceData: FormReferenceDataType;
}) {
  const trpc = useTRPC();
  const router = useRouter();
  const { mutate } = useMutation(
    trpc.productrouter.addProduct.mutationOptions(),
  );
  const categories = formReferenceData?.categoryRecord;
  const subCategories = formReferenceData?.subcategoryRecord;
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddProductSchema>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      productName: "",
      rate: 0,
      productDescription: "",
      mainImage: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      categoryId: categories?.id ?? 0,
      subcategoryId: [],
    },
  });

  const formFields: FormFieldProps<AddProductSchema>[] = [
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
      options: categories
        ? [{ label: categories?.title, value: categories?.id }]
        : [],
      disabled: true,
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
      name: "productDescription",
      placeholder: "Description",
      component: "editor",
      error: errors.productDescription?.message,
    },
  ];

  const formFields2: FormFieldProps<AddProductSchema>[] = [
    {
      control,
      name: "mainImage",
      required: false,
      component: "image",
      error: errors.mainImage?.message,
    },
    {
      control,
      name: "image2",
      component: "image",
      className: "mt-10",
      required: false,
      labelHidden: true,
      error: errors.image2?.message,
    },
    {
      control,
      name: "image3",
      component: "image",
      required: false,
      error: errors.image3?.message,
    },
    {
      control,
      name: "image4",
      component: "image",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
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
          console.log("success", data);
          if (data.success) {
            sweetAlertSuccess(data.message);
            const queryClient = getQueryClient();
            queryClient.invalidateQueries({
              queryKey: trpc.productrouter.showProduct.queryKey(),
            });
            router.push("/profile/product");
          }
        },
        onError: (error) => {
          if (isTRPCClientError(error)) {
            sweetAlertError(error.message);
          }
        },
      },
    );
  };
  return (
    <div className="">
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-6xl">
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-gray-50">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Add Product
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-3">
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

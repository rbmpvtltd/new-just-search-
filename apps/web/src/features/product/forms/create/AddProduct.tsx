"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { productInsertSchema } from "@repo/db/src/schema/product.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import Swal from "sweetalert2";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import { uploadToCloudinary } from "@/components/image/cloudinary";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useTRPC } from "@/trpc/client";
import type { OutputTrpcType } from "@/trpc/type";

type AddProductSchema = z.infer<typeof productInsertSchema>;

type FormReferenceDataType = OutputTrpcType["businessrouter"]["add"] | null;
export default function AddProduct({
  formReferenceData,
}: {
  formReferenceData: FormReferenceDataType;
}) {
  const trpc = useTRPC();
  const { mutate } = useMutation(
    trpc.productrouter.addProduct.mutationOptions(),
  );

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<AddProductSchema>({
    resolver: zodResolver(productInsertSchema),
    defaultValues: {
      productName: "",
      rate: 0,
      productDescription: "",
      photo: "",
      image2: "",
      image3: "",
      image4: "",
      image5: "",
      categoryId: 0,
      subcategoryId: [],
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
      component: "textarea",
      error: errors.productDescription?.message,
    },
    {
      control,
      label: "Product Image",
      name: "photo",
      component: "image",
      error: errors.photo?.message,
    },
    {
      control,
      type: "",
      label: "",
      name: "image2",
      component: "image",
      className: "mt-5",
      required: false,
      error: errors.image2?.message,
    },
    {
      control,
      type: "",
      label: "",
      name: "image3",
      component: "image",
      required: false,
      error: errors.image3?.message,
    },
    {
      control,
      type: "",
      label: "",
      name: "image4",
      component: "image",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
      type: "",
      label: "",
      name: "image5",
      component: "image",
      required: false,
      error: errors.image5?.message,
    },
  ];

  const onSubmit = async (data: any) => {
    const file = await uploadToCloudinary(
      [data.photo, data.image2, data.image3, data.image4, data.image5],
      "offers",
    );
    mutate(
      {
        ...data,
        photo: file[0],
        image2: file[1] ?? "",
        image3: file[2] ?? "",
        image4: file[3] ?? "",
        image5: file[4] ?? "",
      },
      {
        onSuccess: (data) => {
          console.log("success", data);
          Swal.fire({
            title: data.message,
            icon: "success",
            draggable: true,
          });
          // router.push("/");
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

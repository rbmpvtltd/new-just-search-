import { zodResolver } from "@hookform/resolvers/zod";
import { businessDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import LableText from "@/components/inputs/LableText";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { type OutputTrpcType, trpc } from "@/lib/trpc";
import type { UserBusinessListingType } from "..";

type BusinessDetailSchema = z.infer<typeof businessDetailSchema>;
export default function BusinessDetail({
  data,
}: {
  data: UserBusinessListingType;
}) {
  const setFormValue = useBusinessFormStore((s) => s.setFormValue);
  const nextPage = useBusinessFormStore((s) => s.nextPage);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<BusinessDetailSchema>({
    resolver: zodResolver(businessDetailSchema),
    defaultValues: {
      name: data?.business?.name ?? "",
      photo: data?.business?.photo ?? "",
      categoryId: data?.category?.categoryId ?? 0,
      subcategoryId: data?.subcategories?.map((s) => s.subcategoryId) ?? [],
      specialities: data?.business?.specialities ?? "",
      homeDelivery: data?.business?.homeDelivery ?? "",
      description: data?.business?.description ?? "",
      image1: data?.businessPhotos[0]?.photo ?? "",
      image2: data?.businessPhotos[1]?.photo ?? "",
      image3: data?.businessPhotos[2]?.photo ?? "",
      image4: data?.businessPhotos[3]?.photo ?? "",
      image5: data?.businessPhotos[4]?.photo ?? "",
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
    trpc.businessrouter.getSubCategories.queryOptions({
      categoryId: selectedCategoryId,
    }),
  );

  const onSubmit = async (data: BusinessDetailSchema) => {
    const imagesToUpload = [
      data.photo,
      data.image1,
      data.image2,
      data.image3,
      data.image4,
      data.image5,
    ];

    const uploadable = imagesToUpload.map((img) =>
      img?.startsWith("file://") ? img : null,
    );
    const uploadedFiles = await uploadToCloudinary(
      uploadable.filter(Boolean),
      "business",
    );
    const finalImages = imagesToUpload.map((img) =>
      img?.startsWith("file://")
        ? uploadedFiles.shift() // replace with uploaded URL
        : img,
    );

    setFormValue("name", data.name ?? "");
    setFormValue("photo", finalImages[0] ?? "");
    setFormValue("categoryId", data.categoryId ?? "");
    setFormValue("subcategoryId", data.subcategoryId ?? "");
    setFormValue("specialities", data.specialities ?? "");
    setFormValue("homeDelivery", data.homeDelivery ?? "");
    setFormValue("description", data.description ?? "");
    setFormValue("image1", finalImages[1] ?? "");
    setFormValue("image2", finalImages[2] ?? "");
    setFormValue("image3", finalImages[3] ?? "");
    setFormValue("image4", finalImages[4] ?? "");
    setFormValue("image5", finalImages[5] ?? "");
    nextPage();
  };

  const formFields: FormFieldProps<BusinessDetailSchema>[] = [
    {
      control,
      name: "name",
      label: "Business Name",
      placeholder: "Enter your Business Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      editable: false,
      error: errors.name?.message,
    },
    {
      control,
      name: "photo",
      label: "Business Image",
      component: "image",
      className: "mx-auto w-[90%]",
      error: errors.photo?.message,
    },

    {
      control,
      name: "categoryId",
      label: "Category",
      placeholder: "Select Category",
      data: [
        ...(categories ?? []).map((item, index) => ({
          label: item.label,
          value: item.value,
        })),
      ],
      component: "dropdown",
      disable: true,
      className: "w-[90%] bg-base-200",
      error: errors.categoryId?.message,
    },
    {
      control,
      name: "subcategoryId",
      label: "Sub Category",
      placeholder: "Select Sub Category",
      data: [
        ...(subCategories ?? []).map((item, index) => ({
          label: item.name,
          value: item.id,
        })),
      ],
      component: "multiselectdropdown",
      className: "w-[90%] bg-base-200",
      error: errors.subcategoryId?.message,
    },

    {
      control,
      name: "specialities",
      label: "Specialities",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.specialities?.message,
    },
    {
      control,
      name: "homeDelivery",
      label: "Home Delivery",
      component: "dropdown",
      data: [
        { label: "No", value: "no" },
        { label: "Yes", value: "yes" },
      ],
      dropdownPosition: "top",
      error: errors.homeDelivery?.message,
    },
    {
      control,
      name: "description",
      label: "About Your Business",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.description?.message,
    },
  ];

  const formFields2: FormFieldProps<BusinessDetailSchema>[] = [
    {
      control,
      name: "image1",
      component: "image",
      placeholder: "Select Shop Image 1",
      required: false,
      error: errors.image1?.message,
    },
    {
      control,
      name: "image2",
      component: "image",
      placeholder: "Select Shop Image 2",
      required: false,
      error: errors.image2?.message,
    },
    {
      control,
      name: "image3",
      component: "image",
      placeholder: "Select Shop Image 3",
      required: false,
      error: errors.photo?.message,
    },
    {
      control,
      name: "image4",
      component: "image",
      placeholder: "Select Shop Image 4",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
      name: "image5",
      component: "image",
      placeholder: "Select Shop Image 5",
      required: false,
      error: errors.image3?.message,
    },
  ];

  return (
    <>
      <View className="mx-auto w-[90%]">
        {formFields.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      </View>
      <View className="flex-row items-center">
        <LableText title="Shop images" className="ml-11" />
        <Text style={{ color: "red" }} className="ml-1 mt-2">
          *
        </Text>
      </View>
      <View className="mt-2 flex-row flex-wrap items-center justify-center mx-auto w-[100%] gap-2">
        {formFields2.map((field) => (
          <FormField key={field.name} {...field} />
        ))}
      </View>

      <View className="mx-auto w-[90%] mt-6 mb-2">
        <PrimaryButton
          className="w-[40%] mx-auto"
          title="Next"
          onPress={handleSubmit(onSubmit)}
          isLoading={isSubmitting}
        />
      </View>
    </>
  );
}

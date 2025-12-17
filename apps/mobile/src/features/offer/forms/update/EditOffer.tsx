import { zodResolver } from "@hookform/resolvers/zod";
import { offersUpdateSchema } from "@repo/db/dist/schema/offer.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  ScrollView,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import LableText from "@/components/inputs/LableText";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { useAuthStore } from "@/features/auth/authStore";
import { type OutputTrpcType, trpc } from "@/lib/trpc";

type EditOfferSchema = z.infer<typeof offersUpdateSchema>;
type EditOfferType = OutputTrpcType["offerrouter"]["edit"] | null;
export default function EditOffer({ myOffer }: { myOffer: EditOfferType }) {
  const token = useAuthStore((state) => state.token);
  const { data } = useQuery(trpc.offerrouter.add.queryOptions());
  const { mutate } = useMutation(trpc.offerrouter.update.mutationOptions());
  const categories = data?.categoryRecord;
  const subCategories = data?.subcategoryRecord;

  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<EditOfferSchema>({
    resolver: zodResolver(offersUpdateSchema),
    defaultValues: {
      offerName: myOffer?.offer.offerName,
      rate: myOffer?.offer?.rate,
      discountPercent: myOffer?.offer?.discountPercent,
      finalPrice: myOffer?.offer?.finalPrice,
      offerDescription: myOffer?.offer?.offerDescription,
      photo: myOffer?.offer.offerPhotos[0]?.photo || "",
      image2: myOffer?.offer.offerPhotos[1]?.photo || "",
      image3: myOffer?.offer.offerPhotos[2]?.photo || "",
      image4: myOffer?.offer.offerPhotos[3]?.photo || "",
      image5: myOffer?.offer.offerPhotos[4]?.photo || "",
      categoryId: myOffer?.offer.categoryId,
      subcategoryId: myOffer?.offer.offerSubcategory.map(
        (item) => item.subcategoryId,
      ),
    },
  });

  if (!data) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <Text className="text-gray-600">
          Unable to load the form. Try again later.
        </Text>
      </View>
    );
  }

  const onSubmit = async (data: EditOfferSchema) => {
    const file = await uploadToCloudinary(
      [data.photo, data.image2, data.image3, data.image4, data.image5],
      "offers",
    );
    mutate(
      {
        ...data,
        photo: file[0] ?? "",
        image2: file[1] ?? "",
        image3: file[2] ?? "",
        image4: file[3] ?? "",
        image5: file[4] ?? "",
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            //TODO Add query client
            Alert.alert(data.message);
          }
          // router.push("/");
        },
      },
    );
  };

  const formFields: FormFieldProps<EditOfferSchema>[] = [
    {
      control,
      name: "offerName",
      label: "Product Name",
      component: "input",
      keyboardType: "default",
      placeholder: "Offer Name",
      className: "w-[90%] bg-base-200",
      error: errors.offerName?.message,
    },
    {
      control,
      name: "rate",
      label: "Offer Price",
      component: "input",
      keyboardType: "numeric",
      placeholder: "Offer Price",
      className: "w-[90%] bg-base-200",
      error: errors.rate?.message,
      onValueChange: (value) => {
        if (!value) return;
        setValue("finalPrice", Number(value));
      },
    },
    {
      control,
      name: "discountPercent",
      label: " Discount",
      component: "input",
      keyboardType: "numeric",
      placeholder: "e.g 10",
      className: "w-[90%] bg-base-200",
      error: errors.discountPercent?.message,
      onValueChange: (value) => {
        if (!value) return;
        const discount = parseFloat(String(value));
        const price = parseFloat((getValues("rate") || 0).toString());
        const final = (price * (100 - discount)) / 100;
        setValue("discountPercent", Number(value));
        setValue("finalPrice", parseFloat(final.toFixed(2)));
      },
    },
    {
      control,
      name: "finalPrice",
      label: " Final Price",
      component: "input",
      keyboardType: "numeric",
      placeholder: "Final Price",
      className: "w-[90%] bg-base-200",
      error: errors.finalPrice?.message,
    },
    {
      control,
      name: "categoryId",
      label: "Category",
      placeholder: "Select Category",
      data: categories
        ? [{ label: categories.title, value: categories.id }]
        : [],
      component: "dropdown",
      multiselect: 1,
      className: "w-[90%] bg-base-200",
      disable: true,
      error: errors.categoryId?.message,
    },
    {
      control,
      name: "subcategoryId",
      label: "Sub Category",
      placeholder: "Select Sub Category",
      data:
        subCategories?.map((item) => ({
          label: item.name,
          value: item.id,
        })) ?? [],
      component: "multiselectdropdown",
      multiselect: Infinity,
      className: "w-[90%] bg-base-200",
      error: errors?.subcategoryId?.message,
    },
    {
      control,
      name: "offerDescription",
      label: "Offer Description",
      component: "editor",
      keyboardType: "default",
      placeholder: "Offer Description",
      className: "w-[90%] bg-base-200",
      error: errors.offerDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<EditOfferSchema>[] = [
    {
      control,
      name: "photo",
      placeholder: "Select Image 1",
      component: "image",
      required: false,
      error: errors.photo?.message,
    },
    {
      control,
      name: "image2",
      placeholder: "Select Image 2",
      component: "image",
      required: false,
      error: errors.image2?.message,
    },
    {
      control,
      name: "image3",
      placeholder: "Select Image 3",
      component: "image",
      required: false,
      error: errors.image3?.message,
    },
    {
      control,
      name: "image4",
      placeholder: "Select Image 4",
      component: "image",
      required: false,
      error: errors.image4?.message,
    },
    {
      control,
      name: "image5",
      placeholder: "Select Image 5",
      component: "image",
      required: false,
      error: errors.image5?.message,
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView className="w-[100%] h-full">
        <View className=" mx-auto w-[90%]">
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
        <View className="mt-2 flex-1 flex-row flex-wrap items-center justify-center m-auto w-[80%] gap-4">
          {formFields2.map((field) => (
            <FormField labelHidden key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-60">
          <View className="w-[45%]">
            <PrimaryButton
              title="Next"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
}

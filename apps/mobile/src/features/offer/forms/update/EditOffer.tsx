import { zodResolver } from "@hookform/resolvers/zod";
import { offersUpdateSchema } from "@repo/db/dist/schema/offer.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { isTRPCClientError } from "@trpc/client";
import { useRouter } from "expo-router";
import { useForm } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import { uploadToCloudinary } from "@/components/cloudinary/cloudinary";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import LableText from "@/components/inputs/LableText";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { type OutputTrpcType, queryClient, trpc } from "@/lib/trpc";

type EditOfferSchema = z.infer<typeof offersUpdateSchema>;
type EditOfferType = OutputTrpcType["offerrouter"]["edit"] | null;
export default function EditOffer({ myOffer }: { myOffer: EditOfferType }) {
  const router = useRouter();
  const { data, isLoading, isError } = useQuery(
    trpc.offerrouter.add.queryOptions(),
  );
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
      id: myOffer?.offer.id,
      offerName: myOffer?.offer.offerName,
      rate: myOffer?.offer?.rate,
      discountPercent: myOffer?.offer?.discountPercent,
      finalPrice: myOffer?.offer?.finalPrice,
      offerDescription: myOffer?.offer?.offerDescription,
      mainImage: myOffer?.offer?.mainImage ?? "",
      image2: myOffer?.offer.offerPhotos[0]?.photo ?? "",
      image3: myOffer?.offer.offerPhotos[1]?.photo ?? "",
      image4: myOffer?.offer.offerPhotos[2]?.photo ?? "",
      image5: myOffer?.offer.offerPhotos[3]?.photo ?? "",
      categoryId: myOffer?.offer.categoryId,
      subcategoryId: myOffer?.offer.offerSubcategory.map(
        (item) => item.subcategoryId,
      ),
    },
  });

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
      </View>
    );
  }

  const onSubmit = async (data: EditOfferSchema) => {
    const file = await uploadToCloudinary(
      [data.mainImage, data.image2, data.image3, data.image4, data.image5],
      "offers",
    );

    mutate(
      {
        ...data,
        id: myOffer?.offer.id,
        mainImage: file[0] ?? data.mainImage,
        image2: file[1] ?? data.image2,
        image3: file[2] ?? data.image3,
        image4: file[3] ?? data.image4,
        image5: file[4] ?? data.image5,
      },
      {
        onSuccess: (data) => {
          if (data.success) {
            Alert.alert(data.message);
            queryClient.invalidateQueries({
              queryKey: trpc.offerrouter.showOffer.queryKey(),
            });
            router.replace("/(root)/profile/offer");
          }
        },
        onError: (error) => {
          if (isTRPCClientError(error)) {
            Alert.alert(error.message);
          }
          console.error("Error", error.message);
        },
      },
    );
  };

  const formFields: FormFieldProps<EditOfferSchema>[] = [
    {
      control,
      name: "offerName",
      label: "Offer Name",
      component: "input",
      keyboardType: "default",
      placeholder: "Offer Name",
      error: errors.offerName?.message,
    },
    {
      control,
      name: "rate",
      label: "Offer Price",
      component: "input",
      type: "number",
      keyboardType: "numeric",
      placeholder: "Offer Price",
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
      type: "number",
      component: "input",
      keyboardType: "numeric",
      placeholder: "e.g 10",
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
      type: "number",
      keyboardType: "numeric",
      placeholder: "Final Price",
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
      error: errors?.subcategoryId?.message,
    },
    {
      control,
      name: "offerDescription",
      label: "Offer Description",
      component: "editor",
      keyboardType: "default",
      placeholder: "Offer Description",
      error: errors.offerDescription?.message,
    },
  ];
  const formFields2: FormFieldProps<EditOfferSchema>[] = [
    {
      control,
      name: "mainImage",
      placeholder: "Select Image 1",
      component: "image",
      required: false,
      error: errors.mainImage?.message,
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAwareScrollView
        enableOnAndroid
        extraScrollHeight={60}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          paddingHorizontal: 12,
          paddingVertical: 0,
        }}
      >
        <View className=" mx-auto w-[90%]">
          {formFields.map((field) => (
            <FormField key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row items-center ml-8 w-[90%]">
          <LableText title="Offer Images" className="" />
          <Text style={{ color: "red" }} className="ml-1 mt-2">
            *
          </Text>
        </View>
        <View className="mt-2 flex-row flex-wrap items-center gap-2 justify-center ">
          {formFields2.map((field) => (
            <FormField labelHidden key={field.name} {...field} />
          ))}
        </View>
        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-2">
          <View className="w-[45%] mx-auto">
            <PrimaryButton
              title="Submit"
              isLoading={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </View>
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

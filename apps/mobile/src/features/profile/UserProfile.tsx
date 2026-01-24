import { zodResolver } from "@hookform/resolvers/zod";
import { MaritalStatus } from "@repo/db/dist/enum/allEnum.enum";
import { profileUpdateSchema } from "@repo/db/dist/schema/user.schema";
import { useMutation, useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { router } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
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
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { queryClient, trpc } from "@/lib/trpc";

type UserUpdateSchema = z.infer<typeof profileUpdateSchema>;
export default function UserProfile() {
  const { data } = useSuspenseQuery(trpc.userRouter.edit.queryOptions());
  console.log("count");

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      profileImage: data?.profile?.profileImage ?? "",
      firstName: data?.profile?.firstName ?? "",
      dob: data?.profile?.dob ?? "",
      lastName: data?.profile?.lastName ?? "",
      salutation: data?.profile?.salutation ?? 0,
      occupation: data?.profile?.occupation ?? 0,
      maritalStatus: data?.profile?.maritalStatus ?? "Married",
      address: data?.profile?.address ?? "",
      pincode: data?.profile?.pincode ?? "",
      city: data?.profile?.city ?? 0,
      state: data?.profile?.state ?? 0,
    },
  });

  console.log("Error", errors);

  const { mutate } = useMutation(trpc.userRouter.update.mutationOptions());
  const onSubmit = async (data: UserUpdateSchema) => {
    const file = await uploadToCloudinary([data.profileImage], "profile");
    const finalData = {
      ...data,
      profileImage: file[0] ?? "",
    };
    mutate(finalData, {
      onSuccess: (data) => {
        Alert.alert(data.message);
        queryClient.invalidateQueries({
          queryKey: trpc.userRouter.getUserProfile.queryKey(),
        });
        router.replace("/(root)/profile");
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  const states = data?.getStates.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const selectedStateId = useWatch({ control, name: "state" });

  const { data: cities, isLoading } = useQuery(
    trpc.userRouter.getCities.queryOptions({
      state: Number(selectedStateId),
    }),
  );

  const formFields: FormFieldProps<UserUpdateSchema>[] = [
    {
      control,
      name: "profileImage",
      label: "Photo",
      component: "image",
      placeholder: "Select Image",
      required: false,
      className: "mx-auto w-[90%]",
    },
    {
      control,
      name: "salutation",
      label: "Title",
      component: "dropdown",
      data: data.getSlutation.map((item) => ({
        label: item.name,
        value: item.id,
      })),
      required: false,
      placeholder: "Select Title",
      error: errors.salutation?.message,
    },
    {
      control,
      name: "firstName",
      label: "First Name",
      placeholder: "Enter your First Name",
      component: "input",
      required: false,
      className: "w-[90%] bg-base-200",
      error: errors.firstName?.message,
    },
    {
      control,
      name: "lastName",
      label: "Last Name",
      placeholder: "Enter your Last Name",
      component: "input",
      required: false,
      className: "w-[90%] bg-base-200",
      error: errors.lastName?.message,
    },
    {
      control,
      label: "Date of Birth",
      name: "dob",
      placeholder: "Date of Birth",
      required: false,
      component: "datepicker",
      error: errors.dob?.message,
    },
    {
      control,
      label: "Occupation",
      name: "occupation",
      placeholder: "Occupation",
      component: "dropdown",
      data: data.getOccupations.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        };
      }),
      required: false,
      error: errors.occupation?.message,
    },
    {
      control,
      label: "Marital Status",
      name: "maritalStatus",
      placeholder: "Marital Status",
      component: "dropdown",
      data: Object.values(MaritalStatus).map((item) => {
        return {
          label: item,
          value: item,
        };
      }),
      required: false,
      error: errors.maritalStatus?.message,
    },
    {
      control,
      label: "Address",
      name: "address",
      placeholder: "Address",
      component: "input",
      className: "w-[90%] bg-base-200",
      required: false,
      error: errors.address?.message,
    },
    {
      control,
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      className: "w-[90%] bg-base-200",
      component: "input",
      required: false,
      error: errors.pincode?.message,
    },
    {
      control,
      label: "State",
      name: "state",
      placeholder: "State",
      component: "dropdown",
      data:
        states?.map((state) => ({ label: state.label, value: state.value })) ??
        [],
      required: false,
      dropdownPosition: "top",
      error: errors.state?.message,
    },
    {
      control,
      label: "City",
      name: "city",
      placeholder: "City",
      component: "dropdown",
      required: false,
      dropdownPosition: "top",
      data: cities?.map((city) => ({ label: city.city, value: city.id })) ?? [],
      error: errors.city?.message,
    },
  ];

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView>
        <KeyboardAwareScrollView
          className="w-[100%] h-full"
          extraScrollHeight={0}
          enableOnAndroid={true}
          keyboardShouldPersistTaps="handled"
        >
          <View className=" mx-auto w-[90%]">
            {formFields.map((field) => (
              <FormField key={field.name} {...field} />
            ))}
          </View>

          <View className="flex-row justify-between w-[90%] self-center mt-6 mb-12">
            <View className="w-[45%] mx-auto">
              <PrimaryButton
                title="Next"
                isLoading={isSubmitting}
                onPress={handleSubmit(onSubmit)}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

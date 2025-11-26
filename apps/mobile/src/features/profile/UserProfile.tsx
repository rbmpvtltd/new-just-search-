import { zodResolver } from "@hookform/resolvers/zod";
import {
  MaritalStatus,
  userUpdateSchema,
} from "@repo/db/dist/schema/user.schema";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { useForm, useWatch } from "react-hook-form";
import {
  ActivityIndicator,
  Alert,
  Keyboard,
  KeyboardAvoidingView,
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
import PrimaryButton from "@/components/inputs/SubmitBtn";
import { trpc } from "@/lib/trpc";

type UserUpdateSchema = z.infer<typeof userUpdateSchema>;
export default function UserProfile() {
  //   const [loadingLocation, setLoadingLocation] = useState(false);
  const {
    data: formReferenceData,
    error: addError,
    isLoading: addLoading,
    isError: addIsError,
  } = useQuery(trpc.userRouter.add.queryOptions());

  const {
    data: userData,
    isLoading: userDataLoading,
    isError: userDataIsError,
    error: userDataError,
  } = useQuery(trpc.userRouter.getUserProfile.queryOptions());

  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UserUpdateSchema>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: {
      profileImage: userData?.profileImage ?? "",
      firstName: userData?.firstName ?? "",
      dob: userData?.dob ?? "",
      lastName: userData?.lastName ?? "",
      email: userData?.email ?? "",
      salutation: userData?.salutation ?? "",
      occupation: userData?.occupation ?? "",
      maritalStatus: userData?.maritalStatus ?? "Married",
      area: userData?.area ?? "",
      pincode: userData?.pincode ?? "",
      city: userData?.city ?? 0,
      state: userData?.state ?? 0,
    },
  });

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
        console.log("success", data);
      },
      onError: (error) => {
        console.log("error", error);
      },
    });
  };

  const states = formReferenceData?.getStates.map((item: any) => {
    return {
      label: item.name,
      value: item.id,
    };
  });

  const selectedStateId = useWatch({ control, name: "state" });

  const { data: cities, isLoading } = useQuery(
    trpc.hirerouter.getCities.queryOptions({
      state: Number(selectedStateId),
    }),
  );
  if (addLoading || userDataLoading) {
    return (
      <View className="flex-1 items-center justify-center py-10">
        <ActivityIndicator size="large" color="#2563eb" />
        <Text className="text-gray-600 mt-3">Preparing form...</Text>
      </View>
    );
  }

  if (addIsError || userDataIsError) {
    const message =
      addError?.message ||
      userDataError?.message ||
      "Unable to fetch data. Please try again later.";
    return (
      <View className="flex-1 items-center justify-center py-10 px-6">
        <Text className="text-red-600 text-center font-semibold mb-2">
          Something went wrong
        </Text>
        <Text className="text-gray-500 text-sm text-center">{message}</Text>
      </View>
    );
  }

  const formFields: FormFieldProps<UserUpdateSchema>[] = [
    {
      control,
      name: "profileImage",
      label: "Photo",
      component: "image",
      required: false,
      className: "mx-auto w-[90%]",
    },
    {
      control,
      name: "salutation",
      label: "Title",
      component: "dropdown",
      data: [
        { label: "Mr", value: "Mr" },
        { label: "Ms", value: "Ms" },
        { label: "Mrs", value: "Mrs" },
      ],
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
      label: "Email",
      name: "email",
      placeholder: "Email",
      component: "input",
      required: false,
      className: "mx-auto w-[90%]",
      error: errors.email?.message,
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
      data: [
        { label: "Employed", value: "Employed" },
        { label: "Unemployed", value: "Unemployed" },
        { label: "Farmer", value: "Farmer" },
        { label: "Media", value: "Media" },
        { label: "Business Man", value: "Business Man" },
        { label: "Sports", value: "Sports" },
        { label: "Armed forces", value: "Armed forces" },
        { label: "Government Service", value: "Government Service" },
        { label: "CA", value: "CA" },
        { label: "Doctor", value: "Doctor" },
        { label: "Lawyer", value: "Lawyer" },
        { label: "Retired", value: "Retired" },
        { label: "Student", value: "Student" },
        { label: "Clerk", value: "Clerk" },
        { label: "Others", value: "Others" },
      ],
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
      label: "Area",
      name: "area",
      placeholder: "Area",
      component: "input",
      className: "mx-auto w-[90%]",
      required: false,
      error: errors.area?.message,
    },
    {
      control,
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      className: "mx-auto w-[90%]",
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
      error: errors.state?.message,
    },
    {
      control,
      label: "City",
      name: "city",
      placeholder: "City",
      component: "dropdown",
      required: false,
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

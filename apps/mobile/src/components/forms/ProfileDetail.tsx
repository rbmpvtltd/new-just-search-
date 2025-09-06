import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Alert,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CITY_STATE_URL, PROFILE_URL } from "@/constants/apis";
import { apiUrl } from "@/constants/Variable";
import { martialStatus2, occupationData, surnameData } from "@/data/dummy";
import { useSuspenceData } from "@/query/getAllSuspense";
import { usePincodeCityState } from "@/query/pinCode";
import { updateProfile } from "@/query/updateProfile";
import {
  type PersonalDetail,
  personalDetailSchema,
} from "@/schemas/personalDetailSchema";
import { objectToFormData } from "@/utils/objectToFormData";
import PrimaryButton from "../inputs/SubmitBtn";
import { Loading } from "../ui/Loading";
import { FormField, type FormFieldProps } from "./formComponent";
export default function ProfileDetail() {
  const [loadingLocation, setLoadingLocation] = useState(false);

  const router = useRouter();
  const {
    mutate: fetchCityState,
    data: cityStateData,
    isPending,
  } = usePincodeCityState();
  const { data: userProfile } = useSuspenceData(
    PROFILE_URL.url,
    PROFILE_URL.key,
  );
  const { data: cityStateList } = useSuspenceData(
    CITY_STATE_URL.url,
    CITY_STATE_URL.key,
  );

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<PersonalDetail>({
    resolver: zodResolver(personalDetailSchema),
    defaultValues: {
      photo: "",
      salutation: "",
      first_name: "",
      last_name: "",
      email: "",
      dob: new Date(),
      occupation: "",
      marital_status: "",
      area: "",
      zip: "",
      state: 0,
      city: 0,
    },
  });

  // sort city based on selected state
  const selectStatesId = useWatch({ control, name: "state" });

  const cityBasedOnStates =
    selectStatesId && cityStateList?.data?.cities
      ? cityStateList.data.cities.filter(
          (city: any) => city.state_id === selectStatesId,
        )
      : [];

  // console.log("-----------------------------", cityStateList?.data?.states);
  // console.log("-----------------------------", cityStateList?.data?.cities);

  useEffect(() => {
    if (!userProfile) return;
    const firstState = userProfile?.states?.[0] ?? {};
    reset({
      photo:
        userProfile?.user?.photo &&
        `${apiUrl}/assets/images/${userProfile?.user?.photo}`,
      salutation: userProfile?.user?.name?.split(" ")[0] ?? "",
      email: userProfile?.user?.email ?? "",
      dob: userProfile?.user?.dob
        ? new Date(userProfile?.user?.dob)
        : new Date(),
      occupation: userProfile?.user?.occupation ?? "",
      marital_status: userProfile?.user?.marital_status ?? "",
      area: userProfile?.user?.area ?? "",
      zip: userProfile?.user?.zip ?? "",
      state: firstState?.state_id ?? 0,
      city: firstState?.id ?? 0,
    });
  }, [userProfile, reset]);
  const onSubmit = async (data: PersonalDetail) => {
    const formattedDate = data?.dob?.toISOString()?.split("T")[0] || "";
    const finalData = { ...data, dob: formattedDate };

    const finalFormData = objectToFormData(finalData);

    try {
      const response = await updateProfile(finalFormData);
      if (response.success) {
        Alert.alert("Profile updated successfully");
        router.push("/user/bottomNav/profile");
      } else {
        Alert.alert("Error", response.message);
        console.log("something went wrong", response, response.message);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "photo",
      label: "Photo",
      component: "image",
      className: "mx-auto w-[90%]",
    },
    {
      control,
      name: "salutation",
      label: "Title",
      component: "dropdown",
      data: surnameData,
      placeholder: "Select Title",
      error: errors.salutation?.message,
    },
    {
      control,
      name: "first_name",
      label: "First Name",
      placeholder: "Enter your First Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.first_name?.message,
    },
    {
      control,
      name: "last_name",
      label: "Last Name",
      placeholder: "Enter your Last Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.last_name?.message,
    },
    {
      control,
      name: "email",
      label: "Email",
      placeholder: "Enter your Email Address",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.email?.message,
    },
    {
      control,
      name: "dob",
      label: "Date Of Birth",
      component: "datepicker",
      error: errors.dob?.message,
    },
    {
      control,
      name: "occupation",
      label: "Occupation",
      component: "dropdown",
      dropdownPosition: "auto",
      data: occupationData,
      placeholder: "Select Occupation",
      error: errors.occupation?.message,
    },
    {
      control,
      name: "marital_status",
      label: "Marital Status",
      component: "dropdown",
      dropdownPosition: "auto",
      data: [...martialStatus2],
      placeholder: "Select Marital Status",
      error: errors.marital_status?.message,
    },
    {
      control,
      name: "area",
      label: "Area",
      placeholder: "Area",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.area?.message,
    },
    {
      control,
      name: "zip",
      label: "Pincode",
      placeholder: "Enter Pincode",
      component: "input",
      keyboardType: "numeric",
      className: "w-[90%] bg-base-200",
      error: errors.zip?.message,
      onBlurEvent: (val) => {
        console.log("this is on blur on pincode");
        if (val && val.length === 6) {
          setLoadingLocation(true);
          fetchCityState(val, {
            onSuccess: (data) => {
              const state = cityStateList?.data?.states?.find(
                (s: any) => s.name.toLowerCase() === data?.state.toLowerCase(),
              );
              const city = cityStateList?.data?.cities?.find(
                (c: any) => c.city.toLowerCase() == data?.city.toLowerCase(),
              );
              setLoadingLocation(false);
              setValue("state", state?.id);
              setValue("city", city?.id);
            },
          });
        }
      },
    },
    {
      control,
      name: "state",
      label: "State",
      placeholder: "Enter your State",
      component: "dropdown",
      className: "w-[90%] bg-base-200 rounded-lg",
      data: [
        ...(cityStateList?.data?.states?.map((state: any) => ({
          label: state.name,
          value: state.id,
        })) || []),
      ],

      dropdownPosition: "top",
      onValueChange: () => {
        setValue("city", 0);
      },

      error: errors.state?.message,
    },
    {
      control,
      name: "city",
      label: "City",
      placeholder: "Enter your City",
      component: "dropdown",
      className: "w-[90%] bg-base-200 rounded-lg",
      data: [
        ...(cityBasedOnStates?.map((city: any) => ({
          label: city.city,
          value: Number(city.id),
        })) || []),
      ],
      dropdownPosition: "top",
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
            {formFields.map((field, idx) => (
              <FormField key={idx.toString()} {...field} />
            ))}
          </View>

          <View className="w-[37%] mx-auto m-4">
            <PrimaryButton
              isLoading={isSubmitting}
              title="Submit"
              loadingText="Submitting..."
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                marginLeft: "auto",
                marginRight: "auto",
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
              }}
              textClassName="text-secondary text-lg font-semibold"
              disabled={isSubmitting}
              onPress={handleSubmit(onSubmit)}
            />
          </View>
        </KeyboardAwareScrollView>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}

import { zodResolver } from "@hookform/resolvers/zod";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";
import {
  Keyboard,
  ScrollView,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import LocationAutoDetect from "@/components/ui/LocationAutoDetect";
import { CITY_STATE_URL, MY_BUSINESS_LIST_URL } from "@/constants/apis";
import { useSuspenceData } from "@/query/getAllSuspense";
import {
  type BusinessAddressData,
  businessAddressSchema,
} from "@/schemas/businessAdressShema";
import useBusinessFormValidationStore from "@/store/businessFormStore";

export default function EditAddress() {
  const setFormValue = useBusinessFormValidationStore((s) => s.setFormValue);
  const { editBusiness } = useLocalSearchParams();
  const { data: cityStateList } = useSuspenceData(
    CITY_STATE_URL.url,
    CITY_STATE_URL.key,
  );

  const { data: businessList } = useSuspenceData(
    MY_BUSINESS_LIST_URL.url,
    MY_BUSINESS_LIST_URL.key,
    "",
    true,
  );

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<BusinessAddressData>({
    resolver: zodResolver(businessAddressSchema),
    defaultValues: {
      building_name: businessList?.data?.building_name,
      street_name: businessList?.data?.street_name,
      area: businessList?.data?.area,
      landmark: businessList?.data?.landmark,
      latitude: businessList?.data?.latitude,
      longitude: businessList?.data?.longitude,
      pincode: String(businessList?.data?.pincode),
      state: businessList?.data?.state.id,
      city: businessList?.data?.city.id,
    },
  });

  const router = useRouter();
  // sort city based on selected state
  const selectStatesId = useWatch({ control, name: "state" });
  const cityBasedOnStates =
    selectStatesId && cityStateList?.data?.cities
      ? cityStateList.data.cities.filter(
          (city: any) => city.state_id == selectStatesId,
        )
      : [];

  // useEffect(() => {
  //   if (!businessList) return;
  //   reset({
  //     building_name: businessList?.data?.building_name,
  //     street_name: businessList?.data?.street_name,
  //     area: businessList?.data?.area,
  //     landmark: businessList?.data?.landmark,
  //     latitude: businessList?.data?.latitude,
  //     longitude: businessList?.data?.longitude,
  //     pincode: String(businessList?.data?.pincode),
  //     state: businessList?.data?.state.id,
  //     city: businessList?.data?.city.id,
  //   });
  // }, []);

  const onSubmit = (data: BusinessAddressData) => {
    setFormValue("building_name", data.building_name);
    setFormValue("street_name", data.street_name);
    setFormValue("area", data.area);
    setFormValue("landmark", data.landmark);
    setFormValue("latitude", data.latitude);
    setFormValue("longitude", data.longitude);
    setFormValue("pincode", data.pincode);
    setFormValue("state", data.state);
    setFormValue("city", data.city);

    router.push({
      pathname: "/businessEditForms/editBusinessTiming",
      params: { editBusiness: editBusiness },
    });
  };

  const formFields: FormFieldProps[] = [
    {
      control,
      name: "building_name",
      label: "Building Name",
      placeholder: "Building Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.building_name?.message,
    },
    {
      control,
      name: "street_name",
      label: "Colony Name",
      placeholder: "Colony Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.street_name?.message,
    },

    {
      control,
      name: "area",
      label: "Area",
      placeholder: "Enter your Area",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.area?.message,
    },
    {
      control,
      name: "landmark",
      label: "Land Mark",
      placeholder: "Land Mark",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.landmark?.message,
    },
    {
      control,
      name: "latitude",
      label: "Latitude",
      placeholder: "e.g. 26.9124",
      component: "input",
      keyboardType: "numeric",
      className: "w-[90%] bg-base-200",
      error: errors.latitude?.message,
    },
    {
      control,
      name: "longitude",
      label: "Longitude",
      placeholder: "e.g. 75.7878",
      component: "input",
      keyboardType: "numeric",
      className: "w-[90%] bg-base-200",
      error: errors.longitude?.message,
    },
    {
      control,
      name: "pincode",
      label: "Pincode",
      placeholder: "Enter your Pincode",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.pincode?.message,
    },
    {
      control,
      name: "state",
      label: "State",
      placeholder: "Enter your State",
      component: "dropdown",
      className: "w-[90%] bg-base-200",
      data: [
        ...cityStateList.data.states.map((state: any) => ({
          label: state.name,
          value: state.id,
        })),
      ],
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
      className: "w-[90%] bg-base-200",
      data: [
        ...cityBasedOnStates.map((city: any) => ({
          label: city.city,
          value: Number(city.id),
        })),
      ],
      error: errors.city?.message,
    },
  ];
  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAwareScrollView
        className="w-[100%] h-full"
        extraScrollHeight={0}
        enableOnAndroid={true}
        keyboardShouldPersistTaps="handled"
      >
        <View className="mx-auto w-[90%]">
          <LocationAutoDetect
            onResult={(data) => {
              const lat = data.latitude.toString();
              const lng = data.longitude.toString();
              const pincode = data.postalCode || "";
              const cityName = data.city || "";
              const stateName = data.region || "";
              const area = data.name || "";
              const street_name = data?.street || "";
              const landmark = data.street || "";
              const building_name = data.formattedAddress || "";

              const matchedState = cityStateList?.data?.states.find(
                (item: any) =>
                  item.name.toLowerCase() == stateName.toLowerCase(),
              );
              const matchedCity = cityStateList?.data?.cities.find(
                (item: any) =>
                  item.city.toLowerCase() == cityName.toLowerCase() &&
                  item.state_id == matchedState?.id,
              );

              const state = matchedState?.id || "";
              const city = matchedCity?.id || "";

              setValue("latitude", lat);
              setValue("longitude", lng);
              setValue("pincode", pincode);
              setValue("city", city);
              setValue("state", state);
              setValue("area", area);
              setValue("building_name", building_name);
              setValue("street_name", street_name);
              setValue("landmark", landmark);

              setFormValue("latitude", lat);
              setFormValue("longitude", lng);
              setFormValue("pincode", pincode);
              setFormValue("city", city);
              setFormValue("state", state);
              setFormValue("area", area);
              setFormValue("building_name", building_name);
              setFormValue("street_name", street_name);
            }}
          />
          {formFields.map((field, idx) => (
            <FormField {...field} key={idx} />
          ))}
        </View>

        <View className="w-[37%] mx-auto m-6">
          <PrimaryButton
            isLoading={isSubmitting}
            title="Next"
            loadingText="Processing..."
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
    </TouchableWithoutFeedback>
  );
}

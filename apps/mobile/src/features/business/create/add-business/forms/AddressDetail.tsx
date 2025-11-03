import { zodResolver } from "@hookform/resolvers/zod";
import { addressDetailSchema } from "@repo/db/src/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import { useForm, useWatch } from "react-hook-form";
import { Keyboard, TouchableWithoutFeedback, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/forms/formComponent";
import PrimaryButton from "@/components/inputs/SubmitBtn";
import LocationAutoDetect from "@/components/ui/LocationAutoDetect";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { type OutputTrpcType, trpc } from "@/lib/trpc";

type AddressDetailSchema = z.infer<typeof addressDetailSchema>;
type AddBusinessPAgeType = OutputTrpcType["businessrouter"]["add"] | null;
export default function AddressDetail({ data }: { data: AddBusinessPAgeType }) {
  const setFormValue = useBusinessFormStore((s) => s.setFormValue);
  const formValue = useBusinessFormStore((s) => s.formValue);
  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressDetailSchema>({
    resolver: zodResolver(addressDetailSchema),
    defaultValues: {
      buildingName: formValue?.buildingName ?? "",
      streetName: formValue?.streetName ?? "",
      area: formValue?.area ?? "",
      landmark: formValue?.landmark ?? "",
      latitude: formValue?.latitude ?? "",
      longitude: formValue?.longitude ?? "",
      pincode: formValue?.pincode ?? "",
      state: formValue.state ?? 0,
      cityId: formValue?.cityId ?? 0,
    },
  });
  const states = data?.getStates.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const selectedStateId = useWatch({ control, name: "state" });
  const { data: cities, isLoading } = useQuery(
    trpc.businessrouter.getCities.queryOptions({
      state: selectedStateId,
    }),
  );
  const onSubmit = (data: AddressDetailSchema) => {
    setFormValue("buildingName", data.buildingName ?? "");
    setFormValue("streetName", data.streetName ?? "");
    setFormValue("area", data.area ?? "");
    setFormValue("landmark", data.landmark ?? "");
    setFormValue("latitude", data.latitude ?? "");
    setFormValue("longitude", data.longitude ?? "");
    setFormValue("pincode", data.pincode ?? "");
    setFormValue("state", data.state);
    setFormValue("cityId", data.cityId);
  };

  const formFields: FormFieldProps<AddressDetailSchema>[] = [
    {
      control,
      name: "buildingName",
      label: "Building Name",
      placeholder: "Building Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.buildingName?.message,
    },
    {
      control,
      name: "streetName",
      label: "Colony Name",
      placeholder: "Colony Name",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.streetName?.message,
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
      data:
        states?.map((state) => ({ label: state.label, value: state.value })) ??
        [],
      error: errors.state?.message,
    },
    {
      control,
      name: "cityId",
      label: "City",
      placeholder: "Enter your City",
      component: "dropdown",
      className: "w-[90%] bg-base-200",
      data: cities?.map((city) => ({ label: city.city, value: city.id })) ?? [],
      error: errors.cityId?.message,
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
          {/* <LocationAutoDetect
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

              const matchedState = data?.getState?.find(
                (item: any) =>
                  item.name.toLowerCase() === stateName.toLowerCase(),
              );

              const matchedCity = cities?.find(
                (item: any) =>
                  item.city.toLowerCase() === cityName.toLowerCase() &&
                  item.state_id === matchedState?.id,
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
          /> */}
          {formFields.map((field) => (
            <FormField {...field} key={field.name} />
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
      </KeyboardAwareScrollView>
    </TouchableWithoutFeedback>
  );
}

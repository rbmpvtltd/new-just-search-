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
  const nextPage = useBusinessFormStore((s) => s.nextPage);
  const prevPage = useBusinessFormStore((s) => s.prevPage);
  const {
    control,
    handleSubmit,
    setValue,
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
    nextPage();
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
      required: false,
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
          <LocationAutoDetect
            onResult={(data) => {
              console.log("DATA", data);
              const formatted = data.formattedAddress ?? "";
              const parts = formatted.split(",").map((p) => p.trim());

              const lat = data.latitude;
              const lng = data.longitude;
              const pincode = data.postalCode || "";
              const cityName = data.city || "";
              const stateName = data.region || "";
              const area = parts.length > 1 ? parts[2] : "";
              const street_name = parts.length > 1 ? parts[1] : "";
              const landmark = data.street || "";
              const building_name = parts[0].match(/[A-Za-z]/) ? parts[0] : "";

              const matchedState = states?.find(
                (item: any) => item?.label === stateName.toLocaleUpperCase(),
              );

              const matchedCity = cities?.find(
                (item: any) =>
                  item?.city === cityName &&
                  item.stateId === matchedState?.value,
              );

              const state = matchedState?.value || 0;
              const city = matchedCity?.id ?? 0;

              setValue("latitude", String(lat));
              setValue("longitude", String(lng));
              setValue("pincode", pincode);
              setValue("cityId", city);
              setValue("state", state);
              setValue("area", area);
              setValue("buildingName", building_name);
              setValue("streetName", street_name);
              setValue("landmark", landmark);

              setFormValue("latitude", lat);
              setFormValue("longitude", lng);
              setFormValue("pincode", pincode);
              setFormValue("cityId", city);
              setFormValue("state", state);
              setFormValue("area", area);
              setFormValue("buildingName", building_name);
              setFormValue("streetName", street_name);
            }}
          />
          {formFields.map((field) => (
            <FormField {...field} key={field.name} />
          ))}
        </View>

        <View className="flex-row justify-between w-[90%] self-center mt-6 mb-60">
          <View className="w-[45%]">
            <PrimaryButton
              title="Previous"
              variant="outline"
              onPress={prevPage}
            />
          </View>
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

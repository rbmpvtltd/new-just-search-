import { zodResolver } from "@hookform/resolvers/zod";
import { addressDetailSchema } from "@repo/db/dist/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
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
import { trpc } from "@/lib/trpc";
import type { UserBusinessListingType } from "..";

type AddressDetailSchema = z.infer<typeof addressDetailSchema>;
export default function AddressDetail({
  data,
}: {
  data: UserBusinessListingType;
}) {
  const [detectedCityName, setDetectedCityName] = useState<null | string>(null);
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
      buildingName:
        data?.business?.buildingName ?? formValue.buildingName ?? "",
      streetName: data?.business?.streetName ?? formValue.streetName ?? "",
      address: data?.business?.address ?? formValue.address ?? "",
      landmark: data?.business?.landmark ?? formValue.landmark ?? "",
      latitude:
        Number(data?.business?.latitude) ?? Number(formValue.latitude) ?? NaN,
      longitude:
        Number(data?.business?.longitude) ?? Number(formValue.longitude) ?? NaN,
      pincode: data?.business?.pincode ?? formValue.pincode ?? "",
      state: data?.business?.state ?? formValue.state ?? 0,
      city: data?.business?.city ?? formValue.city ?? 0,
    },
  });
  const states = data?.getStates.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const selectedStateId = useWatch({ control, name: "state" });
  const {
    data: cities,
    isLoading,
    isFetching,
  } = useQuery(
    trpc.businessrouter.getCities.queryOptions({
      state: selectedStateId,
    }),
  );

  useEffect(() => {
    if (
      !isLoading &&
      !isFetching &&
      cities &&
      cities.length > 0 &&
      detectedCityName
    ) {
      const matchedCity = cities?.find(
        (c) => c.city.toLowerCase() === detectedCityName.toLowerCase(),
      );
      if (matchedCity && matchedCity.id !== control._formValues.cityId) {
        setValue("city", matchedCity.id, { shouldValidate: true });
      }
    }
  }, [
    detectedCityName,
    control._formValues.cityId,
    isFetching,
    isLoading,
    setValue,
    cities,
  ]);
  const onSubmit = (data: AddressDetailSchema) => {
    setFormValue("buildingName", data.buildingName ?? "");
    setFormValue("streetName", data.streetName ?? "");
    setFormValue("address", data.address ?? "");
    setFormValue("landmark", data.landmark ?? "");
    setFormValue("latitude", data.latitude ?? "");
    setFormValue("longitude", data.longitude ?? "");
    setFormValue("pincode", data.pincode ?? "");
    setFormValue("state", data.state);
    setFormValue("city", data.city);
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
      name: "address",
      label: "Address",
      placeholder: "Enter your Address",
      component: "input",
      className: "w-[90%] bg-base-200",
      error: errors.address?.message,
    },
    {
      control,
      name: "landmark",
      label: "Land Mark",
      placeholder: "Land Mark",
      component: "input",
      required: false,
      className: "w-[90%] bg-base-200",
      error: errors.landmark?.message,
    },
    {
      control,
      name: "latitude",
      label: "Latitude",
      type: "number",
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
      type: "number",
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
      dropdownPosition: "top",
      data:
        states?.map((state) => ({ label: state.label, value: state.value })) ??
        [],
      error: errors.state?.message,
    },
    {
      control,
      name: "city",
      label: "City",
      placeholder: "Enter your City",
      component: "dropdown",
      className: "w-[90%] bg-base-200",
      dropdownPosition: "top",
      data: cities?.map((city) => ({ label: city.city, value: city.id })) ?? [],
      error: errors.city?.message,
    },
  ];
  return (
    <>
      <View className="mx-auto w-[90%]">
        <LocationAutoDetect
          onResult={(data) => {
            const formatted = data.formattedAddress ?? "";
            const parts = formatted.split(",").map((p: string) => p.trim());

            const lat = data.latitude;
            const lng = data.longitude;
            const pincode = data.postalCode || "";
            const cityName = data.city || "";
            const stateName = data.region || "";
            const address = parts.length > 1 ? parts[2] : "";
            const street_name = parts.length > 1 ? parts[1] : "";
            const landmark = data.street || "";
            const building_name = parts[0].match(/[A-Za-z]/) ? parts[0] : "";

            const matchedState = states?.find(
              (item) => item?.label === stateName.toLocaleUpperCase(),
            );

            setDetectedCityName(cityName);

            setValue("latitude", Number(lat));
            setValue("longitude", Number(lng));
            setValue("pincode", pincode);
            setValue("state", matchedState?.value ?? 0);
            setValue("address", address);
            setValue(
              "buildingName",
              building_name ? building_name : street_name,
            );
            setValue("streetName", street_name);
            setValue("landmark", landmark);
          }}
        />
        {formFields.map((field) => (
          <FormField {...field} key={field.name} />
        ))}
      </View>

      <View className="flex-row justify-between w-[90%] self-center mt-6 mb-2">
        <View className="w-[45%]">
          <PrimaryButton title="Back" variant="outline" onPress={prevPage} />
        </View>
        <View className="w-[45%]">
          <PrimaryButton
            title="Next"
            isLoading={isSubmitting}
            onPress={handleSubmit(onSubmit)}
          />
        </View>
      </View>
    </>
  );
}

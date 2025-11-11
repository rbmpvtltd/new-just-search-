"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { addressDetailSchema } from "@repo/db/src/schema/business.schema";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect, useRef } from "react";
import { useForm, useWatch } from "react-hook-form";
import type z from "zod";
import {
  FormField,
  type FormFieldProps,
} from "@/components/form/form-component";
import LocationAutoDetect from "@/components/LocationAutoDetect";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useBusinessFormStore } from "@/features/business/shared/store/useCreateBusinessStore";
import { useTRPC } from "@/trpc/client";
import type { FormReferenceDataType, UserBusinessListingType } from "..";

type AddressDetailSchema = z.infer<typeof addressDetailSchema>;
export default function AddressDetail({
  businessListing,
  formReferenceData,
}: {
  businessListing: UserBusinessListingType;
  formReferenceData: FormReferenceDataType;
}) {
  const trpc = useTRPC();
  const formValue = useBusinessFormStore((state) => state.formValue);
  const setFormValue = useBusinessFormStore((state) => state.setFormValue);
  const nextPage = useBusinessFormStore((state) => state.nextPage);
  const prevPage = useBusinessFormStore((state) => state.prevPage);
  const [detectedCityName, setDetectedCityName] = React.useState<null | string>(
    null,
  );

  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<AddressDetailSchema>({
    resolver: zodResolver(addressDetailSchema),
    defaultValues: {
      buildingName: businessListing?.buildingName ?? "",
      streetName: businessListing?.streetName ?? "",
      area: businessListing?.area ?? "",
      landmark: businessListing?.landmark ?? "",
      latitude: businessListing?.latitude ?? "",
      longitude: businessListing?.longitude ?? "",
      pincode: businessListing?.pincode,
      state: businessListing?.state.id,
      cityId: businessListing?.cityId,
    },
  });

  const states = formReferenceData?.getStates.map((item) => {
    return {
      label: item.name,
      value: item.id,
    };
  });
  const selectedStateId = useWatch({ control, name: "state" });
  const {
    data: cities,
    isLoading,
    isError,
  } = useQuery(
    trpc.businessrouter.getCities.queryOptions({
      state: selectedStateId,
    }),
  );

  if (cities && cities.length > 0 && detectedCityName) {
    const matchedCity = cities.find(
      (c) => c.city.toLowerCase() === detectedCityName.toLowerCase(),
    );
    if (matchedCity && matchedCity.id !== control._formValues.cityId) {
      // Check if cityId is already set to prevent infinite loop
      setValue("cityId", matchedCity.id, { shouldValidate: true });
      // Optional: Clear detectedCityName after setting the value
      // setDetectedCityName(null);
    }
  }

  const formFields: FormFieldProps<AddressDetailSchema>[] = [
    {
      control,
      label: "Block No/Building Name",
      name: "buildingName",
      placeholder: "Block No/Building Name",
      component: "input",
      error: errors.buildingName?.message,
    },
    {
      control,
      label: "Street Name/Colony Name",
      name: "streetName",
      placeholder: "Street Name/Colony Name",
      component: "input",
      error: errors.streetName?.message,
    },
    {
      control,

      label: "Area",
      name: "area",
      placeholder: "Area",
      component: "input",
      error: errors.area?.message,
    },
    {
      control,
      label: "Landmark",
      name: "landmark",
      placeholder: "Landmark",
      component: "input",
      required: false,
      error: errors.landmark?.message,
    },
    {
      control,
      label: "Latitude",
      name: "latitude",
      placeholder: "Latitude",
      component: "input",
      error: errors.latitude?.message,
    },
    {
      control,

      label: "Longitude",
      name: "longitude",
      placeholder: "Longitude",
      component: "input",
      error: errors.longitude?.message,
    },
    {
      control,
      label: "Pincode",
      name: "pincode",
      placeholder: "Pincode",
      component: "input",
      error: errors.pincode?.message,
    },
    {
      control,
      label: "State",
      name: "state",
      placeholder: "State",
      component: "select",
      options:
        states?.map((state) => ({ label: state.label, value: state.value })) ??
        [],
      error: errors.state?.message,
    },
    {
      control,
      label: "City",
      name: "cityId",
      placeholder: "City",
      component: "select",
      loading: isLoading,
      options:
        cities?.map((city) => ({ label: city.city, value: city.id })) ?? [],
      error: errors.cityId?.message,
    },
  ];

  const onSubmit = (data: AddressDetailSchema) => {
    setFormValue("buildingName", data.buildingName ?? "");
    setFormValue("streetName", data.streetName ?? "");
    setFormValue("area", data.area ?? "");
    setFormValue("landmark", data.landmark ?? "");
    setFormValue("latitude", data.latitude ?? "");
    setFormValue("longitude", data.longitude ?? "");
    setFormValue("pincode", data.pincode ?? "");
    setFormValue("state", Number(data.state) ?? "");
    setFormValue("cityId", Number(data.cityId) ?? "");
    nextPage();
  };
  return (
    <div className="p-8 bg-gray-100 min-h-screen">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="shadow-xl mx-auto rounded-xl max-w-6xl bg-white"
      >
        <div className="p-8 space-y-8">
          <div className="p-6 shadow rounded-xl bg-white">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              Business Address
            </h2>
            <p className="mt-3 text-sm text-gray-500 italic mb-4">
              Your latitude and longitude will only be used to improve
              location-based services and will remain confidential. This
              information will not be shared publicly.
            </p>
            <div className="flex items-end justify-between mb-4 w-fit">
              <LocationAutoDetect
                onResult={(data) => {
                  console.log("Detected:", data);
                  const formatted = data.formattedAddress ?? "";
                  const parts = formatted.split(",").map((p) => p.trim());
                  const lat = data.latitude;
                  const long = data.longitude;
                  const pincode = data.postalCode || "";
                  const cityName = data.city || "";
                  const stateName = data.region || "";
                  const area = data.name || "";
                  const street_name = data.street || "";
                  const landmark = data.street || "";
                  const building_name = parts[0]?.match(/[A-Za-z]/)
                    ? parts[0]
                    : "";

                  const matchedState = states?.find(
                    (item: any) => item.label === stateName.toLocaleUpperCase(),
                  );

                  console.log("matchedState", cityName);

                  setDetectedCityName(cityName);

                  setValue("buildingName", building_name ?? "");
                  setValue("streetName", street_name ?? "");
                  setValue("area", area ?? "");
                  setValue("landmark", landmark ?? "");
                  setValue("latitude", String(lat));
                  setValue("longitude", String(long));
                  setValue("pincode", pincode ?? "");
                  setValue("state", matchedState?.value ?? 0);
                }}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
              {formFields.map((field, index) => (
                <FormField key={field.name} {...field} />
              ))}
            </div>
          </div>
        </div>
        <div className="flex justify-end p-6 border-t border-gray-200 gap-4">
          <Button
            onClick={prevPage}
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            PREVIOUS
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-700 font-bold"
          >
            {isSubmitting ? (
              <>
                <Spinner /> Loading...
              </>
            ) : (
              "CONTINUE"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

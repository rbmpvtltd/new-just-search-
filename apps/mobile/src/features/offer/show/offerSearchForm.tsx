import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePathname } from "expo-router";
import { useForm } from "react-hook-form";
import { Alert, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";
import {
  type SearchFormData,
  searchFormSchema,
} from "@/schemas/searchFormSchema";
import { useCityStore } from "@/store/cityStore";
import CitySearch from "../../../components/inputs/CitySearch";
import OfferCategorySearch from "../../../components/inputs/OfferCategorySearch";
import PrimaryButton from "../../../components/inputs/SubmitBtn";
import ErrorText from "../../../components/ui/ErrorText";

export default function OfferSearchForm({ bgColor }: { bgColor?: string }) {
  const setCity = useCityStore((state) => state.setCity);

  const {
    formState: { errors, isSubmitting },
    watch,
    setValue,
  } = useForm<SearchFormData>({
    resolver: zodResolver(searchFormSchema),
    defaultValues: {
      location: "",
      category: "",
    },
  });
  const colorScheme = useColorScheme();

  const pathname = usePathname();

  const location = watch("location");
  const category = watch("category");

  const handleCitySelect = (city: string) => {
    setCity(city);
    setValue("location", city); // Update form value
  };
  const handleCategorySelect = (category: string) => {
    setValue("category", category);
  };

  const onSearch = async () => {
    if (!category || !location) {
      Alert.alert("Please Enter Both Location And Category");
      return;
    }
    const query = `?location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`;
    const targetPath = `/allOfferListings/allOfferListing${query}`;

    if (pathname + location + category === targetPath) {
      console.log("Already on the target page. No navigation needed.");
      return;
    }
    router.navigate({
      pathname: "/home", // TODO: add real allOfferListing
      params: { location, category },
    });
  };

  return (
    <View
      className={`w-full bg-base-200 rounded-2xl shadow-lg overflow-hidden ${bgColor}`}
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 8,
      }}
    >
      {/* Form Content */}
      <View className="px-3 py-2 gap-2">
        {/* Location Input */}
        <View>
          <View
            className="rounded-xl overflow-hidden"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.05,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <CitySearch
              onSelect={handleCitySelect}
              placeholder="Enter your location"
            />
          </View>
          {errors.location && (
            <View className="mt-1 ml-1">
              <ErrorText title={errors.location.message} />
            </View>
          )}
        </View>

        {/* Category Input with Search Button */}
        <View>
          <View className="flex-row items-start gap-2">
            <View
              className="flex-1 rounded-xl overflow-hidden"
              style={{
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.05,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              <OfferCategorySearch
                onSelect={handleCategorySelect}
                placeholder="What service do you need?"
                className="flex-1 mx-0"
              />
            </View>

            <View
              className="rounded-xl overflow-hidden"
              style={{
                shadowColor: Colors[colorScheme ?? "light"].primary,
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.3,
                shadowRadius: 8,
                elevation: 4,
              }}
            >
              <PrimaryButton
                isLoading={isSubmitting}
                title="Search"
                loadingText="Searching..."
                style={{
                  backgroundColor: isSubmitting
                    ? Colors[colorScheme ?? "light"]["error-content"]
                    : Colors[colorScheme ?? "light"].primary,
                  paddingHorizontal: 24,
                  paddingVertical: 14,
                  borderRadius: 12,
                  minWidth: 100,
                  flexDirection: "row",
                  alignItems: "center",
                  justifyContent: "center",
                }}
                disabled={isSubmitting || !location || !category}
                onPress={onSearch}
              />
            </View>
          </View>
          {errors.category && (
            <View className="mt-1 ml-1">
              <ErrorText title={errors.category.message} />
            </View>
          )}
        </View>
      </View>
    </View>
  );
}

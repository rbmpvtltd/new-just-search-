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
import CitySearch from "../inputs/CitySearch";
import HireCategorySearch from "../inputs/HireCategorySearch";
import PrimaryButton from "../inputs/SubmitBtn";
import ErrorText from "../ui/ErrorText";

export default function HireSearchForm({ bgColor }: { bgColor?: string }) {
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
    const targetPath = `/allHireListings/allHireListing${query}`;

    if (pathname + location + category === targetPath) {
      console.log("Already on the target page. No navigation needed.");
      return;
    }
    router.navigate({
      pathname: "/allHireListings/allHireListing",
      params: { location, category },
    });
  };

  return (
    <View
      className={`w-[100%] bg-base-200 h-auto py-1 gap-6 px-4 rounded-md ${bgColor}`}
    >
      <CitySearch onSelect={handleCitySelect} placeholder="Enter a Location" />
      {errors.location && <ErrorText title={errors.location.message} />}
      <View className="flex-row items-start justify-center w-[100%] ">
        <HireCategorySearch
          onSelect={handleCategorySelect}
          placeholder="Search Hires"
        />
        <View className="w-[30%] mt-[2px] ">
          <PrimaryButton
            isLoading={isSubmitting}
            title="Search"
            loadingText="Sear..."
            style={{
              backgroundColor: isSubmitting
                ? Colors[colorScheme ?? "light"]["error-content"]
                : Colors[colorScheme ?? "light"].primary,
              width: "100%",
              padding: 12,
              borderRadius: 8,
              marginLeft: "auto",
              marginRight: "auto",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
            }}
            textClassName="text-[#ffffff] text-lg font-semibold"
            disabled={isSubmitting}
            onPress={onSearch}
          />
        </View>
      </View>
    </View>
  );
}

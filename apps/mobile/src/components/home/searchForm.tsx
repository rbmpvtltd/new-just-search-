import { zodResolver } from "@hookform/resolvers/zod";
import { router, usePathname } from "expo-router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Alert, useColorScheme, View } from "react-native";
import Colors from "@/constants/Colors";
import {
  type SearchFormData,
  searchFormSchema,
} from "@/schemas/searchFormSchema";
import CategorySearch from "../inputs/CategorySearch";
import CitySearch from "../inputs/CitySearch";
import PrimaryButton from "../inputs/SubmitBtn";
import ErrorText from "../ui/ErrorText";

export default function SearchForm({ bgColor }: { bgColor?: string }) {
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

  const [suggestions, setSuggestions] = useState([]);
  const pathname = usePathname();

  const location = watch("location");
  const category = watch("category");

  const handleCitySelect = (city: string) => {
    setValue("location", city); // Update form value
  };
  const handleCategorySelect = (category: string) => {
    setValue("category", category);
  };

  const fetchSuggestions = async (title: string, city: string) => {
    try {
      const res = await fetch(
        `https://justsearch.net.in/api/search-listings?title=${title}&city=${city}`,
      );
      const data = await res.json();
      setSuggestions(data?.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  // TODO: remove use effect and optimine it
  useEffect(() => {
    const delay = setTimeout(() => {
      if (location.length > 2 && category.length > 2) {
        fetchSuggestions(category, location);
      }
    }, 300);
    return () => clearTimeout(delay);
  }, [location, category]);

  const onSearch = async () => {
    if (!category || !location) {
      Alert.alert("Please enter both location and category");
      return;
    }
    const query = `?location=${encodeURIComponent(location)}&category=${encodeURIComponent(category)}`;
    const targetPath = `/allListings/allListing${query}`;

    if (pathname + location + category === targetPath) {
      console.log("Already on the target page. No navigation needed.");
      return;
    }
    router.navigate({
      pathname: "/allListings/allListing",
      params: { location, category }, // ✅ pass as query params
    });
  };

  return (
    <View
      className={`w-[100%] bg-base-200 h-auto py-4 gap-6 px-4  rounded-md ${bgColor}`}
    >
      <CitySearch onSelect={handleCitySelect} placeholder="Enter a Location" />
      {errors.location && <ErrorText title={errors.location.message} />}
      <View className="flex-row items-start justify-center w-[100%]">
        <CategorySearch
          onSelect={handleCategorySelect}
          placeholder="Search What You Want"
        />
        <View className="w-[37%] ml-auto">
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

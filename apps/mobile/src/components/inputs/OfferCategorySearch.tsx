import type React from "react";
import { useEffect, useState } from "react";
import {
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import Colors from "@/constants/Colors";
import { useSearchCatogries } from "@/query/categorySearch";
import { useOfferSearchCategory } from "@/query/offerCategorySearch";
import { useCityStore } from "@/store/cityStore";
import { Loading } from "../ui/Loading";
import { SomethingWrong } from "../ui/SomethingWrong";

interface Category {
  id: number;
  name: string;
  building_name: string;
  street_name: string;
  area: string;
  city: number;
  latitude: string;
  longitude: string;
}

interface CategorySearchProps {
  onSelect: (category: string) => void;
  placeholder?: string;
  onBlur?: () => void; // Add onBlur prop
  className?: string;
}

const OfferCategorySearch: React.FC<CategorySearchProps> = ({
  onSelect,
  placeholder,
  onBlur,
  className
}) => {
  const city = useCityStore((state) => state.city);
  const colorScheme = useColorScheme();
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { data, isLoading, isError } = useOfferSearchCategory(query, city);

  if (isLoading) <Loading position="center" />;
  if (isError) <SomethingWrong />;

  const suggestions = query.length === 0 ? [] : (data?.pages[0]?.data ?? []);

  function handleChangeInput(text: string) {
    setQuery(text);
    onSelect(text);
    // Reopen the FlatList when user starts typing
    if (text.length > 0) {
      setIsFocused(true);
    }
  }

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handleSelect = (category: Category) => {
    const categoryList = `${category}`;
    setQuery(categoryList);
    onSelect(categoryList);
    setIsFocused(false); // Close the FlatList after selection
    console.log(data);
  };

  return (
    <View className={`mx-2 relative ${className}`}>
      <TextInput
        placeholder={placeholder}
        value={query}
        placeholderTextColor={Colors[colorScheme ?? "light"]["secondary"]}
        onChangeText={handleChangeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="bg-base-100 text-secondary h-[50px] px-3 rounded-t-lg rounded-b-md text-[16px]"
      />

      {isFocused && suggestions.length > 0 && (
        // <FlatList
        //   keyboardShouldPersistTaps="handled"
        //   className="bg-base-100 text-secondary-100 max-h-[200px]"
        //   data={suggestions}
        //   scrollEnabled={false}
        //   nestedScrollEnabled={true}
        //   keyExtractor={(item, index) =>
        //     item?.id ? item.id.toString() : index.toString()
        //   }
        //   renderItem={({ item }) => {
        //     return (
        //       <TouchableOpacity
        //         className="p-[12px] border-b border-b-base-300 bg-base-100"
        //         onPress={() => handleSelect(item)}
        //       >
        //         <Text className=" text-secondary">{item}</Text>
        //       </TouchableOpacity>
        //     );
        //   }}
        // />

        <View
          style={{
            maxHeight: 200,
            position: "absolute",
            zIndex: 999,
            top: 50,
            left: 0,
            right: 0,
          }}
        >
          <ScrollView
            keyboardShouldPersistTaps="handled"
            nestedScrollEnabled
            style={{
              backgroundColor: Colors[colorScheme ?? "light"]["base-100"],
            }}
            className="rounded-b-lg"
          >
            {suggestions.map((item: any) => (
              <TouchableOpacity
                key={String(item?.id)}
                className="p-[12px] rounded-md"
                onPress={() => handleSelect(item)}
              >
                <Text className="text-secondary ">{item}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default OfferCategorySearch;

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
}

const CategorySearch: React.FC<CategorySearchProps> = ({
  onSelect,
  placeholder,
  onBlur,
}) => {
  const colorScheme = useColorScheme();
  const [query, setQuery] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const { data, isLoading, isError } = useSearchCatogries(query);

  if (isLoading) <Loading position="center" />;
  if (isError) <SomethingWrong />;

  const suggestions = data?.pages[0]?.data?.data?.flat() ?? [];
  // useEffect(() => {
  //   if (query.length >= 2 && data && isFocused) {
  //   } else {
  //     setSuggestions([]);
  //   }
  // }, [query, data, isFocused]);

  function handleChangeInput(text: string) {
    setQuery(text);
    onSelect(text);
  }

  const handleBlur = () => {
    setIsFocused(false);
    if (onBlur) onBlur();
  };

  const handleSelect = (category: Category) => {
    const categoryList = `${category.name}`;
    setQuery(categoryList);
    onSelect(categoryList);
    setIsFocused(false);
  };

  return (
    <View className="w-[57%]  relative ">
      <TextInput
        placeholder={placeholder}
        value={query}
        placeholderTextColor={Colors[colorScheme ?? "light"]["secondary"]}
        onChangeText={handleChangeInput}
        onFocus={() => setIsFocused(true)}
        onBlur={handleBlur}
        className="bg-base-100 rounded-b-sm text-secondary h-[50px] px-3 rounded-t-lg text-[16px]"
      />

      {isFocused && suggestions.length > 0 && (
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
              flexGrow: 0,
            }}
            className="rounded-b-lg"
          >
            {suggestions.map((item: Category) => (
              <TouchableOpacity
                key={item?.id}
                className="p-[12px] rounded-md"
                onPress={() => handleSelect(item)}
              >
                <Text className="text-secondary"> {item?.name} </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CategorySearch;

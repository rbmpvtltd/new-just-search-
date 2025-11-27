import type React from "react";
import { useEffect, useState } from "react";
import {
  Alert,
  FlatList,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Colors from "@/constants/Colors";
import { useSearchCities } from "@/query/citySearch";
import LocationAutoDetect from "../ui/LocationAutoDetect";

interface City {
  city_id: number;
  city_name: string;
  state_id: number;
  state_name: string;
}

interface CitySearchProps {
  onSelect: (city: string) => void;
  placeholder?: string;
}

const CitySearch: React.FC<CitySearchProps> = ({
  onSelect,
  placeholder = "Search for a city...",
}) => {
  const colorScheme = useColorScheme();
  const [query, setQuery] = useState("");
  const [isManualSelection, setIsManualSelection] = useState<boolean>(false);
  const [suggestions, setSuggestions] = useState<City[]>([]);

  const { data } = useSearchCities(query);

  useEffect(() => {
    if (query.length >= 2 && data && !isManualSelection) {
      setSuggestions(data.pages[0]?.data.data.flat() ?? []);
    } else {
      setSuggestions([]);
    }
  }, [query, data, isManualSelection]);

  const handleInputChange = (text: string) => {
    setIsManualSelection(false);
    onSelect(text);
    setQuery(text);
  };

  const handleSelect = (city: City) => {
    const cityString = `${city.city_name}`;
    setIsManualSelection(true);
    setQuery(cityString);
    onSelect(cityString);
    setSuggestions([]);
  };

  const handleAutoDetect = (result: {
    success: boolean;
    latitude: number | undefined;
    longitude: number | undefined;
    name: string;
    street: string;
    formattedAddress: string;
    postalCode?: string;
    city?: string;
    region?: string;
    country?: string;
  }) => {
    if (result.success) {
      const cityName = result.city ? result.city : "";
      if (!cityName) {
        Alert.alert("Location Error", "Unable to fetch address.");
      }
      setQuery(cityName);
      onSelect(cityName);
    }
  };

  return (
    <View className="w-full relative">
      {/* input + icon wrapper */}

      <View className="relative">
        <TextInput
          placeholder={placeholder}
          value={query}
          placeholderTextColor={Colors[colorScheme ?? "light"].secondary}
          onChangeText={handleInputChange}
          className="bg-base-100 h-[50px] rounded-t-lg rounded-b-sm text-[16px] text-secondary"
        />

        <View className="absolute right-3 top-4 -translate-y-1/4">
          <LocationAutoDetect onResult={handleAutoDetect} iconOnly />
        </View>
      </View>

      {suggestions.length > 0 && (
        // <FlatList
        //   keyboardShouldPersistTaps="handled"
        //   className="z-50 max-h-[200px] mt-1 bg-base-100 rounded-lg"
        //   data={suggestions}
        //   scrollEnabled={false}
        //   nestedScrollEnabled={true}
        //   keyExtractor={(item, index) =>
        //     item?.city_id ? item.city_id.toString() : index.toString()
        //   }
        //   renderItem={({ item }) => (
        //     <TouchableOpacity
        //       className="p-[12px] border-b border-b-base-300 rounded-lg"
        //       onPress={() => handleSelect(item)}
        //     >
        //       <Text className="text-[16px] text-secondary">
        //         {item.city_name}, {item.state_name}
        //       </Text>
        //     </TouchableOpacity>
        //   )}
        // />
        <View
          style={{
            position: "absolute",
            zIndex: 999,
            top: 82,
            left: 0,
            right: 0,
            maxHeight: 200,
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
            {suggestions.map((item) => (
              <TouchableOpacity
                key={item.city_id}
                className="p-[12px] rounded-lg"
                onPress={() => handleSelect(item)}
              >
                <Text className="text-[16px] text-secondary">
                  {item.city_name}, {item.state_name}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default CitySearch;

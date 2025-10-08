import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect, usePathname } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  ScrollView,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { CATEGORY_URL } from "@/constants/apis";
import Colors from "@/constants/Colors";
import { useSuspenceData } from "@/query/getAllSuspense";
import { useHeadingStore } from "@/store/heading";
import Input from "../inputs/Input";

export const CategoryList = () => {
  const colorScheme = useColorScheme();

  const [search, setSearch] = useState("");
  const [filteredData, setFilteredData] = useState<any[]>([]);
  const { setHeading } = useHeadingStore();
  const { data: allCategories, refetch } = useSuspenceData(
    CATEGORY_URL.url,
    CATEGORY_URL.key,
  );

  const [isNavigating, setIsNavigating] = useState(false);
  const pathname = usePathname();
  const [value, setValue] = useState<"hire" | "business">("hire");
  const [showModal, setShowModal] = useState(false);

  const visibleData = useMemo(() => {
    if (!allCategories?.categories) return [];

    return allCategories.categories
      .filter((cat:any) => (value === "hire" ? cat.type === 2 : cat.type === 1))
      .slice(0, 11);
  }, [value, allCategories?.categories]);

  const fullData = useMemo(() => {
    if (!allCategories?.categories) return [];

    return allCategories.categories.filter((cat:any) =>
      value === "hire" ? cat.type === 2 : cat.type === 1,
    );
  }, [value, allCategories?.categories]);

  const handleValueChange = (val: string) => {
    if (val === "hire" || val === "business") {
      setValue(val as "hire" | "business");
    }
  };

  const handleSearch = (text: string) => {
    setSearch(text);
    if (!text) {
      setFilteredData(fullData);
      return;
    }
    const filteredData = fullData.filter((item:any) =>
      item.title.toLowerCase().includes(text.toLowerCase()),
    );

    setFilteredData(filteredData);

    // if (filteredData.length > 0) {
    //   setHeading(filteredData[0].title);
    // }
  };

  useEffect(() => {
    setFilteredData(fullData);
  }, [fullData]);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [refetch]),
  );

  if (!allCategories) {
    return <ActivityIndicator size={"small"} />;
  }

  return (
    <>
      <View className="flex my-2 mx-4 flex-row">
        <Text className="text-xl font-black text-secondary">
          Popular on Just {""}
        </Text>
        <Text className="text-xl font-black text-primary">Search</Text>
      </View>
      {/* Radio buttons */}
      <View className="px-4 pt-4 w-[90%] flex-1">
        <RadioButton.Group onValueChange={handleValueChange} value={value}>
          <View className="flex-row items-center justify-center gap-6 mb-4">
            <Pressable onPress={() => handleValueChange("hire")}>
              <View
                className={`${
                  value === "hire" && "bg-primary"
                } flex-row items-center justify-start rounded-md border border-secondary-content px-8 py-2 `}
              >
                <Text className="text-secondary">Hire</Text>
              </View>
            </Pressable>
            <Pressable onPress={() => handleValueChange("business")}>
              <View
                className={`${
                  value === "business" && "bg-primary"
                } flex-row items-center justify-start rounded-md border border-secondary-content px-8 py-2`}
              >
                <Text className="text-secondary">Business</Text>
              </View>
            </Pressable>
          </View>
        </RadioButton.Group>
      </View>

      <View className="bg-base-100 w-[100%] h-80 flex-wrap flex-row items-center justify-between">
        {visibleData?.map((item: any, i: number) => (
          <View className="w-[25%] justify-center items-center mb-10" key={i.toString()}>
            <Pressable
              onPress={() => {
                const targetPath = `/subcategory/${encodeURIComponent(item.id)}`;
                setHeading(item.title);
                if (pathname === targetPath || isNavigating) return;

                setIsNavigating(true);
                router.navigate({
                  pathname: "/subcategory/[subcategory]",
                  params: { subcategory: item?.id },
                });
                setTimeout(() => setIsNavigating(false), 500);
              }}
            >
              <Image
                className="h-10 w-10 rounded-md m-auto"
                source={{
                  uri: `https://justsearch.net.in/assets/images/categories/${item?.photo}`,
                }}
              />
              <Text className="text-secondary text-center text-xs">
                {item.title}
              </Text>
            </Pressable>
          </View>
        ))}

        {fullData?.length > 9 && (
          <Pressable
            className="w-[25%] justify-center items-center mb-10"
            onPress={() => setShowModal(true)}
          >
            <Text className="text-[#ffffff] w-10 bg-primary text-center p-2 rounded-full text-xs">
              <Ionicons name="chevron-down" size={14} color="#fff" />
            </Text>
          </Pressable>
        )}
      </View>
      {/* <View className="flex-1 bg-base-100 p-4"> */}
      <Modal
        visible={showModal}
        animationType="slide"
        onRequestClose={() => setShowModal(false)}
        transparent
      >
        <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]}>
          <View className="flex-1 bg-base-100 p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-secondary">
                All {value} Categories
              </Text>
              <Pressable
                onPress={() => {
                  setShowModal(false);
                  setSearch("");
                }}
              >
                <Ionicons
                  name="close"
                  size={24}
                  style={{
                    color: Colors[colorScheme ?? "light"]["secondary"],
                  }}
                />
              </Pressable>
            </View>

            <Input
              placeholder="Search..."
              className="border border-secondary mb-4 w-[90%] mx-auto"
              value={search}
              onChange={(e) => handleSearch(e.nativeEvent.text)}
            />
            <ScrollView>
              <View></View>
              <View className="flex-row flex-wrap">
                {filteredData?.map((item: any, i: number) => (
                  <Pressable
                    key={i.toString()}
                    className="w-[25%] mb-6 items-center"
                    onPress={() => {
                      setShowModal(false);
                      setHeading(item.title);
                      router.navigate({
                        pathname: "/subcategory/[subcategory]",
                        params: { subcategory: item.id },
                      });
                    }}
                  >
                    <Image
                      className="h-12 w-12 rounded-md"
                      source={{
                        uri: `https://justsearch.net.in/assets/images/categories/${item.photo}`,
                      }}
                    />
                    <Text className="text-xs text-center mt-1 text-secondary">
                      {item.title}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </SafeAreaView>
      </Modal>
      {/* </View> */}
    </>
  );
};

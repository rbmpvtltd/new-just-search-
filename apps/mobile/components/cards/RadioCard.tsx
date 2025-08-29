import { router } from "expo-router";
import { memo, useState } from "react";
import {
  FlatList,
  Image,
  Pressable,
  Text,
  useColorScheme,
  View,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { ALL_BUSINESS_CATEGORIES, ALL_HIRE_CATEGORIES } from "@/constants/apis";
import Colors from "@/constants/Colors";
import type { CategoryItem } from "@/query/category";
import { useCategory } from "@/query/home/category";
import { useHeadingStore } from "@/store/heading";
import { Loading } from "../ui/Loading";

const RadioCard = () => {
  const [value, setValue] = useState<string>("hire");

  const handleValueChange = (value: string) => {
    if (value === "hire" || value === "business") {
      setValue(value);
    }
  };

  return (
    <View className="px-4 pt-4 w-[90%] flex-1">
      <RadioButton.Group onValueChange={handleValueChange} value={value}>
        <View className="flex-row items-center justify-center gap-6 mb-4">
          <Pressable onPress={() => handleValueChange("hire")}>
            <View
              className={`${value === "hire" && "bg-primary"} flex-row items-center justify-start rounded-md border border-secondary-content px-8 py-2 `}
            >
              <Text className="text-secondary">Hire</Text>
            </View>
          </Pressable>
          <Pressable onPress={() => handleValueChange("business")}>
            <View
              className={`${value === "business" && "bg-primary"} flex-row items-center justify-start rounded-md border border-secondary-content px-8 py-2`}
            >
              <Text className="text-secondary">Business</Text>
            </View>
          </Pressable>
        </View>
      </RadioButton.Group>

      {value === "hire" ? (
        <FlatListRadioCard
          kagi={ALL_HIRE_CATEGORIES.key}
          url={ALL_HIRE_CATEGORIES.url}
          type={2}
        />
      ) : (
        <FlatListRadioCard
          kagi={ALL_BUSINESS_CATEGORIES.key}
          url={ALL_BUSINESS_CATEGORIES.url}
          type={1}
        />
      )}
    </View>
  );
};

const RenderItem = ({ item, type }: { item: CategoryItem; type: number }) => {
  const { setHeading } = useHeadingStore();
  const colorSheme = useColorScheme();
  return (
    <Pressable
      style={{
        backgroundColor: Colors[colorSheme ?? "light"]["base-200"],
        borderRadius: 16,
        width: "48%",
        marginBottom: 16,
        overflow: "hidden",
        alignItems: "center",
      }}
      onPress={() => {
        setHeading(item.title);
        router.navigate({
          pathname: "/subcategory/[subcategory]",
          params: { subcategory: item.id, type: String(type) },
        });
      }}
    >
      <View className="w-[300px] h-[120px] relative flex justify-center items-center ">
        <Image
          className="w-full h-32 aspect-[3/4]"
          source={{
            uri: `https://justsearch.net.in/assets/images/categories/${item?.photo}`,
          }}
        />
      </View>
      <View className="p-4 ">
        <Text className="font-semibold text-sm text-secondary">
          {item?.title}
        </Text>
      </View>
    </Pressable>
  );
};

const FlatListRadioCard = memo(
  ({ kagi, url, type }: { kagi: string; url: string; type: number }) => {
    const { data, fetchNextPage, hasNextPage, isLoading, isFetchingNextPage } =
      useCategory({ key: kagi, url, enabled: Boolean(kagi && url) });

    if (isLoading) {
      return <Loading position="center" />;
    }

    const allData = data?.pages.flatMap((page) => page?.data || []) || [];

    const renderItemCallback = ({ item }: { item: CategoryItem }) => {
      return <RenderItem item={item} type={type} />;
    };

    return (
      <FlatList
        data={allData}
        keyExtractor={(_, index) => index.toString()}
        renderItem={renderItemCallback}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        numColumns={2}
        onEndReachedThreshold={0.5}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        ListFooterComponent={() => (isFetchingNextPage ? <Loading /> : null)}
      />
    );
  },
);

export default RadioCard;

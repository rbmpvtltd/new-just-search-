import { Ionicons } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import React, { useCallback } from "react";
import { FlatList, Pressable, RefreshControl, Text, View } from "react-native";
import MyToken from "@/features/help-and-support/show/MyToken";
import { type OutputTrpcType, trpc } from "@/lib/trpc";

type MyTokenType = OutputTrpcType["helpAndSupportRouter"]["show"][number];
type OfferType = NonNullable<
  OutputTrpcType["offerrouter"]["showOffer"]
>["offers"][number];
export default function index() {
  const { data: myTokens } = useQuery(
    trpc.helpAndSupportRouter.show.queryOptions(),
  );

  const flatData: MyTokenType[] = myTokens ?? [];
  const router = useRouter();
  const renderItem = useCallback(
    ({ item, index }: { item: MyTokenType; index: number }) => (
      <MyToken myTokens={item} />
    ),
    [],
  );
  return (
    <FlatList
      data={flatData}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      ListHeaderComponent={
        <View className="px-4 mt-4 flex-row justify-center ">
          <Pressable
            className="bg-primary py-3 rounded-xl w-[50%] flex-row items-center justify-center"
            onPress={() =>
              router.navigate("/(root)/profile/help-and-support/add")
            }
          >
            <Ionicons name="add-circle-outline" size={20} color="#fff" />
            <Text className="text-secondary ml-2 font-semibold">
              Create Ticket
            </Text>
          </Pressable>
        </View>
      }
      // refreshControl={
      //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      // }
    />
  );
}

import { router } from "expo-router";
import { FlatList, Text, View } from "react-native";
import { Pressable } from "react-native-gesture-handler";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";
import DataNotFound from "@/components/ui/DataNotFound";
import { useProductSession } from "@/query/chat/chatsession.query";
import { maskPhone } from "@/utils/helper";

export default function HireChats() {
  const { data: productChats } = useProductSession();

  if (!productChats?.length) {
    return <DataNotFound />;
  }

  return (
    <>
      <FlatList
        className="bg-base-200"
        data={productChats}
        renderItem={({ item, index }) => {
          const productName =
            item?.product?.product_name.length > 25
              ? `${item?.product?.product_name?.slice(0, 25)}...`
              : item?.product?.product_name;
          return (
            <Pressable
              onPress={() => {
                router.push({
                  pathname: "/chat/[chat]",
                  params: { chat: item?.id?.toString() },
                });
              }}
            >
              <View
                className={`${index % 2 === 0 ? "bg-base-200" : "bg-base-100"} px-4 py-3 flex-row gap-6 items-center w-[100%]`}
              >
                <View className="relative">
                  <AvatarWithFallback
                    uri={`https://www.justsearch.net.in/assets/images/${item?.product?.image1}`}
                    index={index}
                  />

                  {/* <Ionicons
                    name="ellipse"
                    size={15}
                    color="#00a884"
                    className="absolute -left-1"
                  /> */}
                </View>
                <View className="w-[100%]">
                  <View className="flex-row justify-between items-start w-[80%]">
                    <View>
                      <Text className="text-secondary text-2xl font-semibold w-[100%]">
                        {item?.listing
                          ? item.listing?.name
                          : item?.user
                            ? item.user?.name
                              ? item.user.name
                              : item.user?.phone
                                ? maskPhone(item.user.phone)
                                : item.user?.email
                                  ? item.user.email
                                  : "user"
                            : "user"}
                      </Text>
                      <Text
                        className={`text-secondary text-sm font-semibold w-[100%]`}
                      >
                        {item?.product ? productName : "Just Search"}
                      </Text>
                    </View>
                  </View>

                  {/* Don't remove this it will be usefull in future */}
                  {/* <View className="flex-row justify-between items-center">
                      <Text className="text-secondary text-[12px]">
                        {item.message}
                      </Text>
                      {item.is_read === 1 && (
                        <Ionicons
                          name="checkmark-done-circle-outline"
                          size={18}
                          color="#00a884"
                          className=""
                        />
                      )}
                      {item.isSended == 0 && (
                        <Ionicons
                          name="checkmark-done-circle-outline"
                          size={18}
                          color="#71889b"
                          className=""
                        />
                      )}
                    </View> */}
                </View>
              </View>
            </Pressable>
          );
        }}
      />
      {/* <SafeAreaView className="absolute -bottom-[10px] right-[15px]">
        <View className="p-4 rounded-full bg-primary">
          <Pressable
            className="p-4 rounded-full bg-primary"
            onPress={handleClear}
            disabled={isPending}
          >
            <Ionicons
              name="trash-outline"
              size={30}
              color={Colors[colorScheme ?? "light"].secondary}
              className=""
            />
          </Pressable>
        </View>
      </SafeAreaView> */}
    </>
  );
}

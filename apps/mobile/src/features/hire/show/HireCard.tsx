// import Ionicons from "@expo/vector-icons/Ionicons";
// import { router } from "expo-router";
// import { useEffect, useState } from "react";
// import {
//   Dimensions,
//   Image,
//   Text,
//   TouchableOpacity,
//   useColorScheme,
//   View,
// } from "react-native";
// import { Pressable } from "react-native-gesture-handler";
// import Colors from "@/constants/Colors";
// import { useStartChat } from "@/query/startChat";
// import { useAuthStore } from "@/store/authStore";
// import { showLoginAlert } from "@/utils/alert";
// import { dialPhone } from "@/utils/getContact";
// import { OutputTrpcType } from "@/lib/trpc";

// type HireCardType = OutputTrpcType["hirerouter"]["MobileAllHireLising"]["data"][0] | null

// const screenWidth = Dimensions.get("window").width;
// export default function HireCard({ item, title }: {item : HireCardType ,title? :any}) {
//   const colorScheme = useColorScheme();
//   const { mutate: startChat } = useStartChat();
//   const isAuthenticated = useAuthStore((state) => state.authenticated);
//   const clearToken = useAuthStore((state) => state.clearToken);

//   const [aspectRatio, setAspectRatio] = useState(3 / 4);

//   // Fetch image dimensions to calculate aspect ratio
//   useEffect(() => {
//     if (item?.photo) {
//       const imgUrl = `https://www.justsearch.net.in/assets/images/${item?.photo}`;
//       Image.getSize(
//         imgUrl,
//         (width, height) => {
//           if (width > 0 && height > 0) {
//             setAspectRatio(Number((width / height).toFixed(2))); // safe float
//           }
//         },
//         () => {
//           setAspectRatio(3 / 4); // fallback if image fails
//         },
//       );
//     }
//   }, [item?.photo]);
//   const imgUrl = item?.photo
//     ? `https://www.justsearch.net.in/assets/images/${item?.photo}`
//     : "https://www.justsearch.net.in/assets/images/9706277681737097544.jpg";
//   if (!item || !item?.name) return null;
//   return (
//     <View className="h-auto rounded-xl m-auto w-[90%] pb-4 bg-base-200 mb-4 shadow-2xl">
//       <View
//         className="mx-auto mt-2 w-[60%]"
//         style={{ aspectRatio, height: screenWidth * 0.6 * (1 / aspectRatio) }}
//       >
//         <Pressable onPress={() => router.push(`/(root)/(hire)/hireDetail/${item.id}`)}>
//           <Image
//             className="w-full h-full rounded-lg"
//             source={{
//               uri: imgUrl,
//             }}
//             resizeMode="contain"
//           />
//         </Pressable>
//       </View>
//       <View className="flex-row justify-between items-center w-[100%]">
//         <View className="w-[80%]">
//           <Text className="text-secondary text-2xl m-4 font-semibold">
//             {item?.name}
//           </Text>
//         </View>
//         {/* <View className="w-[20%] flex items-center justify-center">
//           {Number(item?.user?.verify) === 1 && (
//             <Ionicons name="checkmark-circle" size={28} color="green" />
//           )}
//         </View> */}
//       </View>
//       <View className="flex-row gap-2 m-4 flex-wrap">

//           <TouchableOpacity
//             className="bg-success-content rounded-lg py-2 px-3 mb-1"
//           >
//             <Text className="text-success font-semibold text-xs">
//               {item?.category ?? "fake category"}
//             </Text>
//           </TouchableOpacity>
//         {item?.subcategories?.map((item: string, i: number) => (
//           <TouchableOpacity
//             key={i.toString()}
//             className="bg-error-content rounded-lg py-2 px-3 mb-1"
//           >
//             <Text className="text-pink-700 font-semibold text-xs">
//               {item}
//             </Text>
//           </TouchableOpacity>
//         ))}
//       </View>

//       <View className="mx-4 ">
//         <Text className="text-secondary-content">{item.jobRole}</Text>
//       </View>
//       <View className="mx-4 my-2">
//         <Text className="text-secondary-content">
//           {item?.jobType}
//         </Text>
//       </View>
//       <View className="mx-4 my-2">
//         <Text className="text-secondary-content">
//           <Ionicons name="location" />
//           {item?.area} {item.streetName}, {item.buildingName}
//         </Text>
//       </View>
//       <Pressable
//         onPress={() => {
//           if (!isAuthenticated) {
//             showLoginAlert({
//               message: "Need to login to chat on your behalf",
//               onConfirm: () => {
//                 clearToken();
//                 router.push("/(root)/profile/profile");
//               },
//             });
//           } else {
//             startChat(String(item.id), {
//               onSuccess: (res) => {
//                 console.log("Chat started:", res.chat_session_id);

//                 router.push({
//                   pathname: "/chat/[chat]",
//                   params: { chat: res?.chat_session_id.toString() },
//                 });
//               },
//               onError: (err) => {
//                 console.error("Failed to start chat:", err);
//               },
//             });
//           }
//         }}
//         style={{
//           width: "90%",
//           backgroundColor: Colors[colorScheme ?? "light"].primary,
//           padding: 8,
//           borderRadius: 4,
//           marginTop: 8,
//           marginHorizontal: "auto",
//         }}
//       >
//         <View className="text-xl text-center flex-row py-1 gap-2 justify-center items-start">
//           <Ionicons name="chatbox-ellipses" size={20} color={"white"} />
//           <Text className="text-[#ffffff] text-center font-semibold">
//             Chat Now
//           </Text>
//         </View>
//       </Pressable>
//       <Pressable
//         onPress={() => dialPhone(item?.phoneNumber ?? "")}
//         style={{
//           width: "90%",
//           backgroundColor: Colors[colorScheme ?? "light"].primary,
//           padding: 8,
//           borderRadius: 4,
//           marginTop: 8,
//           marginHorizontal: "auto",
//         }}
//       >
//         <View className="text-xl text-center flex-row py-1 gap-2 justify-center items-start">
//           <Ionicons name="call" size={20} color={"white"} />
//           <Text className="text-[#ffffff] text-center font-semibold">
//             Contact Now
//           </Text>
//         </View>
//       </Pressable>
//     </View>
//   );
// }

import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  Alert,
  Platform,
  Pressable,
  Share,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from "react-native";
import type { HireListingHitType } from "@/app/(root)/(hire)/hire";
import type { SubcategoryHitType } from "@/app/(root)/(home)/subcategory/[subcategory]";
import AvatarWithFallback from "@/components/ui/AvatarWithFallback";

export default function HireCard({
  item,
}: {
  item: HireListingHitType | SubcategoryHitType;
  title?: any;
}) {
  const colorScheme = useColorScheme();

  const onShare = async () => {
    try {
      const shareUrl = `https://web-test.justsearch.net.in//hireDetail/${item?.objectID}`;

      const result = await Share.share(
        {
          title: item?.name ?? "",
          message:
            Platform.OS === "android"
              ? `${item?.name ?? ""}\n\n${shareUrl}`
              : (item?.name ?? ""),
          url: shareUrl, // iOS uses this
        },
        {
          dialogTitle: "Share Offer",
        },
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // iOS specific (AirDrop, WhatsApp, etc.)
          console.log("Shared via:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error: any) {
      Alert.alert("Error", error?.message ?? "Unable to share");
    }
  };

  return (
    <Pressable
      className=""
      onPress={() => router.navigate(`/hireDetail/${item?.objectID}`)}
    >
      <View className="h-auto rounded-xl m-auto w-[90%] bg-base-200 py-8 mb-4 shadow-2xl ">
        <View className="flex-row items-center justify-center w-full">
          <View className="relative top-1">
            <AvatarWithFallback
              uri={`https://www.justsearch.net.in/assets/images/9706277681737097544.jpg`}
              imageClass="w-[150px] h-[150px] rounded-full border-2 border-secondary"
              iconClass="p-6 rounded-full border-2 border-secondary flex items-center justify-center"
              imageStyle={{ resizeMode: "contain" }}
            />
            {/*{Number(item?.user?.verify) === 1 && (
              <View className="absolute -bottom-3 left-1/2 -translate-x-1/2">
                <View
                  className="px-4 py-1 rounded-lg flex-row items-center gap-1"
                  style={{
                    backgroundColor:
                      colorScheme === "dark" ? "#A855F7" : "#9333EA",
                  }}
                >
                  <Text className="text-[#fff] text-sm font-semibold">
                    Trusted
                  </Text>
                  <Ionicons name="checkmark-circle" size={18} color="#fff" />
                </View>
              </View>
            )} */}
          </View>
        </View>
        <View className="w-full mt-8 mb-2 px-4 relative items-center">
          {/* Centered title */}
          <Text
            className="text-secondary text-2xl font-semibold text-center"
            numberOfLines={2}
          >
            {item?.name}
          </Text>

          {/* Share button at end */}
          <Pressable
            hitSlop={10}
            className="absolute right-4 top-1/2 -translate-y-1/2"
            onPress={onShare}
          >
            <Ionicons name="share-social" size={22} color="black" />
          </Pressable>
        </View>

        <View className="flex-row flex-wrap gap-2 ml-4">
          <TouchableOpacity
            className="bg-success-content rounded-lg py-2 px-2 mb-1"
            onPress={() => router.navigate(`/hireDetail/${item?.objectID}`)}
          >
            <Text className="text-success font-semibold text-xs">
              {item?.category ?? "fake category"}
            </Text>
          </TouchableOpacity>

          {item?.subcategories?.slice(0, 2).map((sub: string, i: number) => (
            <TouchableOpacity
              key={i.toString()}
              className="bg-error-content rounded-lg py-2 px-2 mb-1"
              onPress={() => router.navigate(`/hireDetail/${item?.objectID}`)}
            >
              <Text className="text-pink-700 font-semibold text-xs">{sub}</Text>
            </TouchableOpacity>
          ))}
          {Number(item?.subcategories?.length) > 2 && (
            <TouchableOpacity
              className="dark:bg-base-100 bg-base-200 rounded-lg py-2 px-4 mb-1"
              onPress={() => router.navigate(`/hireDetail/${item?.objectID}`)}
            >
              <Text className="text-secondary font-semibold text-xs">
                + More
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* <View className="mx-4 my-1">
          <View className="flex-row items-start">
            <Text className="text-secondary font-black mr-2">Job Role :</Text>
            <Text className="text-secondary-content flex-1">
              {item?.jobRole}
            </Text>
          </View>
        </View> */}

        <View className="mx-4 my-2">
          <View className="flex-row items-start">
            <Text className="text-secondary font-black mr-2">Job Type : </Text>
            {item?.jobType && (
              <Text className="text-secondary-content flex-1">
                fake job{item?.jobType.join(", ")}
              </Text>
            )}
          </View>
        </View>

        <View className="mx-4 my-2">
          <View className="flex-row items-center gap-2 w-[90%]">
            <Ionicons
              name="location"
              size={22}
              color={colorScheme === "dark" ? "#F87171" : "#DC2626"}
            />
            <Text className="text-base text-secondary-content">
              {item?.area}, {item?.buildingName}{" "}
              {/** TODO: add street name when seed update */}
            </Text>
          </View>
        </View>

        <View className="flex-row w-[60%] mx-auto items-center justify-center gap-2">
          <View className="flex-1 bg-primary rounded-lg px-2 py-2">
            <Pressable
              onPress={() => router.navigate(`/hireDetail/${item?.objectID}`)}
            >
              <View className="flex-row items-center justify-center gap-1">
                <Ionicons name="chatbox-ellipses" size={20} color={"white"} />
                <Text
                  className="font-semibold text-sm"
                  style={{ color: "white" }}
                >
                  Chat Now
                </Text>
              </View>
            </Pressable>
          </View>

          <View className="flex-1 bg-primary rounded-lg px-2 py-2">
            <Pressable
              onPress={() => router.navigate(`/hireDetail/${item?.objectID}`)}
            >
              <View className="flex-row items-center justify-center gap-1">
                <Ionicons name="call" size={20} color={"white"} />
                <Text
                  className="font-semibold text-sm"
                  style={{ color: "white" }}
                >
                  Call Now
                </Text>
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

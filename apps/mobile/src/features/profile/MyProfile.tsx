import { useSuspenseQuery } from "@tanstack/react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import { cld } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";

export const MyProfile = () => {
  const role = useAuthStore((state) => state.role);
  const { data: userData } = useSuspenseQuery(
    trpc.userRouter.getUserProfile.queryOptions(),
  );

  return (
    <View className=" bg-base-300 py-8 mt-4 w-[90%] rounded-lg">
      <View className="flex-row items-center relative justify-around w-[100%] gap-4 px-8">
        <View className="relative">
          <View className="w-28 h-28 rounded-lg">
            <AdvancedImage
              cldImg={cld.image(userData?.profileImage || "")}
              className="w-[100%] h-[100%] rounded-full border-2 border-secondary"
            />
          </View>
           {/* <AdvancedImage
              cldImg={cld.image(userData?.profileImage || "")}
              className="w-[100%] h-[100%] rounded-full border-2 border-secondary"
            />
          </View> */}
        </View>
        <View className="w-[80%] ">
          <View className=" w-[90%] flex-row items-center">
            <View className="w-[80%]">
              <Text className="text-secondary text-2xl p-2 font-semibold w-full">
                {userData?.firstName
                  ? `${userData.firstName} ${userData.lastName}`
                  : "Guest"}
              </Text>
            </View>
            <View className="w-[20%]">
              {/* {data?.verify && (
                        <Ionicons
                          name="checkmark-circle"
                          size={36}
                          color="green"
                        />
                      )} */}
            </View>
          </View>
          <View className="w-[80%]">
            <Text className="w-full mx-2 text-secondary-content text-[16px]  mt-2">
              {userData.role}
            </Text>

            {/* <Text className="w-full mx-2 text-secondary-content text-[16px] ">
                      {userData?.email ? userData.email : `+91 1234567890`}
                    </Text> */}
          </View>
        </View>
      </View>

      <View className="mx-10 mt-8 w-[100%]">
        <View className="flex-row gap-4 mb-6 items-center">
          <Text className="font-semibold text-lg text-secondary">
            Profile Type :
          </Text>
          <Text className="text-secondary">{userData.role}</Text>
        </View>
        <View className="flex-row gap-4 mb-6 w-[100%] items-start">
          <Text className="font-semibold text-lg text-secondary">
            Address :
          </Text>
          <Text className="text-secondary break-words w-[200px]">
            {userData?.address
              ? userData.address
              : (userData?.address ?? "No Address")}
          </Text>
        </View>
        <View className="flex-row gap-4 mb-6 w-[100%] items-center">
          <Text className="font-semibold text-lg text-secondary">
            Activated Plan :
          </Text>
          <Text className="text-secondary w-[80%] break-words ">
            {/* {data?.plan?.title ?? "Free"} */}
          </Text>
        </View>
      </View>
      <Pressable
        onPress={() => router.navigate("/(root)/profile/edit-profile")}
      >
        <View className="mx-10">
          <View className="flex-row gap-4 bg-primary p-4 rounded-lg w-full items-center justify-center">
            <Text className="text-secondary text-center">Profile Setting</Text>
          </View>
        </View>
      </Pressable>
    </View>
  );
};

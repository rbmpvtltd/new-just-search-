import { useQuery } from "@tanstack/react-query";
import { AdvancedImage } from "cloudinary-react-native";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Loading } from "@/components/ui/Loading";
import { SomethingWrong } from "@/components/ui/SomethingWrong";
import { useAuthStore } from "@/features/auth/authStore";
import { cld } from "@/lib/cloudinary";
import { trpc } from "@/lib/trpc";

export const MyProfile = () => {
  const role = useAuthStore((state) => state.role);
  const {
    data: userData,
    isLoading,
    error,
    isError,
  } = useQuery(trpc.userRouter.getUserProfile.queryOptions());

  if (isLoading) {
    return <Loading position="center" />;
  }

  if (isError) {
    return <SomethingWrong />;
  }

  console.log("User", userData);

  return (
    <View className="bg-base-300 py-6 mt-4 w-[92%] rounded-2xl self-center">
      <View className="flex-row items-center gap-5 px-6">
        <View className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary items-center justify-center bg-primary/10">
          {userData?.profile?.profileImage ? (
            <AdvancedImage
              cldImg={cld.image(userData.profile.profileImage)}
              className="w-full h-full"
            />
          ) : (
            <Text className="text-primary font-bold text-3xl">
              {userData?.profile?.firstName
                ? userData.profile.lastName
                  ? userData.profile.firstName.charAt(0).toUpperCase() +
                    userData.profile.lastName.charAt(0).toUpperCase()
                  : userData.profile.firstName.charAt(0).toUpperCase()
                : "G"}
            </Text>
          )}
        </View>

        <View className="flex-1">
          <Text className="text-secondary text-xl font-semibold">
            {userData?.profile?.firstName
              ? `${userData.profile.firstName} ${userData?.profile?.lastName ?? ""}`
              : "Guest User"}
          </Text>

          <Text className="text-secondary-content text-sm mt-1">
            {userData?.role?.toUpperCase() ?? "GUEST"}
          </Text>

          <Text className="text-secondary-content text-sm mt-1">
            {userData?.user?.email
              ? userData.user.email
              : userData?.user?.phoneNumber}
          </Text>
        </View>
      </View>

      <View className="h-px bg-base-200 my-6 mx-6" />

      <View className="px-6 space-y-10 gap-2">
        <View className="flex-row gap-2">
          <Text className="font-semibold text-secondary w-32">
            Profile Type
          </Text>
          <Text className="text-secondary-content flex-1">
            {userData?.role?.toUpperCase() ?? "N/A"}
          </Text>
        </View>

        <View className="flex-row gap-2 items-start">
          <Text className="font-semibold text-secondary w-32">Address</Text>
          <Text className="text-secondary-content flex-1">
            {userData?.profile?.address?.trim()
              ? userData.profile.address
              : "No address provided"}
          </Text>
        </View>

        <View className="flex-row items-center gap-3">
          <Text className="font-semibold text-secondary w-32">
            Activated Plan
          </Text>

          {/* Status Dot */}
          <View
            className={`w-2.5 h-2.5 rounded-full ${
              userData?.plan?.name && userData.plan.name !== "FREE"
                ? "bg-green-500"
                : "bg-red-500"
            }`}
          />

          {/* Plan Badge */}
          <View
            className={`px-3 py-1 rounded-full ${
              userData?.plan?.name && userData.plan.name !== "FREE"
                ? "bg-green-100"
                : "bg-red-100"
            }`}
          >
            <Text
              className={`text-sm font-medium ${
                userData?.plan?.name && userData.plan.name !== "FREE"
                  ? "text-green-700"
                  : "text-red-700"
              }`}
            >
              {userData?.plan?.name ?? "Free"}
            </Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={() => router.navigate("/(root)/profile/edit-profile")}
        className="mt-8 mx-6"
      >
        <View className="bg-primary py-3 rounded-xl items-center">
          <Text className="text-white font-semibold">Edit Profile</Text>
        </View>
      </Pressable>
    </View>
  );
};

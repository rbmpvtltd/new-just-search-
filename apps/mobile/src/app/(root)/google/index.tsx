import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { useAuthStore } from "@/features/auth/authStore";
import { queryClient, trpc } from "@/lib/trpc";
import { deviceId, platform } from "@/utils/getDeviceId";
import { setTokenRole } from "@/utils/secureStore";

GoogleSignin.configure({
  webClientId:
    "968676221050-ootcr7d06h9a6qqc5bd335n2tu6htadr.apps.googleusercontent.com",
  iosClientId:
    "571980400521-nd45lmn71u436lbj62gi5t7i82osuve1.apps.googleusercontent.com",
});

const GoogleLogin = () => {
  const { mutate } = useMutation(trpc.auth.mobileOauth.mutationOptions());
  const setAuthStoreToken = useAuthStore((state) => state.setToken);
  const { mutate: pushTokenMutation } = useMutation(
    trpc.notificationRouter.createPushToken.mutationOptions(),
  );
  async function onClick() {
    console.log("start login with google");
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
    mutate(
      {
        idToken: userInfo.data?.idToken ?? "",
        provider: "google",
        user: {
          email: userInfo.data?.user.email ?? "",
          name: userInfo.data?.user.givenName ?? "",
          id: userInfo.data?.user.id ?? "",
        },
      },
      {
        onSuccess: async (data) => {
          console.log("==============>", data);
          setAuthStoreToken(
            data?.data?.token ?? "",
            data.data?.role ?? "visiter",
          );
          // await Purchases.logIn(data?.revanueCatToken ?? "");
          await setTokenRole(
            data?.data?.token ?? "",
            data.data?.role ?? "visiter",
          );
          queryClient.invalidateQueries({
            queryKey: trpc.auth.verifyauth.queryKey(),
          });
          const pushToken = await AsyncStorage.getItem("pushToken");

          if (!pushToken) {
            console.log("No push token found in AsyncStorage");
            return;
          }

          console.log("Push token found:", pushToken);
          pushTokenMutation(
            {
              deviceId: String(deviceId),
              platform: platform,
              token: String(pushToken),
            },
            {
              onSuccess: (data) => {
                console.log("data inserted successfully=========>", data);
                // return router.back();
              },
              onError: (err) => {
                console.log("failed data insertion ====>", err);
              },
            },
          );
          // await Purchases.logIn(data?.ravanueCatId ?? "");
          // Alert.alert("Login Successfully");
          console.log("Login Successfully");
          router.push("/");
        },
        onError: (error) => {
          console.log("==============>", error);
        },
      },
    );
  }
  return (
    <View className="w-full items-center mt-6">
      <Pressable
        onPress={onClick}
        className="flex-row items-center justify-center w-full bg-white border border-gray-300 rounded-xl py-4"
        android_ripple={{ color: "#e5e7eb" }}
      >
        <Ionicons name="logo-google" size={20} color="#EA4335" />
        <Text className="ml-3 text-base font-semibold text-gray-800">
          Continue with Google
        </Text>
      </Pressable>
    </View>
  );
};

export default GoogleLogin;

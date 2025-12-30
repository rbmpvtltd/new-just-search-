import { trpc } from "@/lib/trpc";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { useMutation } from "@tanstack/react-query";
import { Pressable, Text, View } from "react-native";

GoogleSignin.configure({
  webClientId:
    "571980400521-9idj6c5b7ga8ecsngjur45or6uhk65c5.apps.googleusercontent.com",
  iosClientId:
    "571980400521-nd45lmn71u436lbj62gi5t7i82osuve1.apps.googleusercontent.com",
});

const GoogleLogin = () => {
  const { mutate } = useMutation(trpc.auth.mobileOauth.mutationOptions());
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
        onSuccess: (data) => {
          console.log("==============>", data);
        },
        onError: (error) => {
          console.log("==============>", error);
        },
      },
    );
  }
  return (
    <View className="flex-1 justify-center items-center">
      <Pressable onPress={onClick} className="bg-primary text-white py-4 px-5">
        <Text className="text-secondary">Login With Google</Text>
      </Pressable>
    </View>
  );
};

export default GoogleLogin;

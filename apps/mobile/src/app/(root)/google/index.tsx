import { GoogleSignin } from "@react-native-google-signin/google-signin";
import { Pressable, Text, View } from "react-native";

GoogleSignin.configure({
  webClientId:
    "968676221050-brhretmcqmd0pavpus0rg38vall2fbfp.apps.googleusercontent.com",
  iosClientId:
    "571980400521-nd45lmn71u436lbj62gi5t7i82osuve1.apps.googleusercontent.com",
});

const GoogleLogin = () => {
  async function onSumbmit() {
    console.log("start login with google");
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    console.log(userInfo);
  }
  return (
    <View className="flex-1 justify-center items-center">
      <Pressable
        onPress={onSumbmit}
        className="bg-primary text-white py-4 px-5"
      >
        <Text className="text-secondary">Login With Google</Text>
      </Pressable>
    </View>
  );
};

export default GoogleLogin;

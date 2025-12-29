import { Pressable, Text, View } from "react-native";
import { GoogleSignin } from "@react-native-google-signin/google-signin";
GoogleSignin.configure({
  webClientId:
    "571980400521-es8jn3ged1mu8elmrpei5p765isacrn7.apps.googleusercontent.com",
  offlineAccess: true,
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

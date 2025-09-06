import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import { useEffect } from "react";
import { Text, TouchableOpacity, View } from "react-native";

WebBrowser.maybeCompleteAuthSession();

const CLIENT_ID =
  "571980400521-qso4du1t2stviagep99gk6b9mdfhfhb1.apps.googleusercontent.com";

const discovery = {
  authorizationEndpoint: "https://accounts.google.com/o/oauth2/v2/auth",
  tokenEndpoint: "https://oauth2.googleapis.com/token",
  revocationEndpoint: "https://oauth2.googleapis.com/revoke",
};

export default function GoogleLoginForm() {
  const redirectUri = AuthSession.makeRedirectUri();

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: CLIENT_ID,
      redirectUri: AuthSession.makeRedirectUri({
        preferLocalhost: true,
      }),
      scopes: ["openid", "profile", "email"],
      responseType: "token",
    },
    discovery,
  );

  useEffect(() => {
    if (response?.type === "success") {
      const { access_token } = response.params;
      console.log(access_token);
      // sendToBackend(access_token);
    }
  }, [response]);

  return (
    <View>
      <TouchableOpacity
        className={`mt-5 p-4 rounded-lg flex items-center justify-center w-[90%] bg-primary`}
        onPress={() => {
          console.log("clicked on form change button ");
          promptAsync();
        }}
      >
        <Text className="text-secondary text-lg font-semibold">google</Text>
      </TouchableOpacity>
    </View>
  );
}

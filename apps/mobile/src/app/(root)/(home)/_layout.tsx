import { Stack } from "expo-router";
import { KeyboardAvoidingView, Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function HomeLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="subcategory" options={{ headerShown: false }} />
      <Stack.Screen name="chat" options={{ headerShown: false }} />
      <Stack.Screen
        name="home"
        options={{
          headerShown: false,
          headerLeft: () => {
            return (
              <View>
                <Text className="text-secondary">this is the end</Text>
              </View>
            );
          },
        }}
      />
    </Stack>
  );
}

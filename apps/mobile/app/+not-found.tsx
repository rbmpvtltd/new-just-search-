import { router, Stack } from "expo-router";
import { Pressable, StyleSheet, Text, View } from "react-native";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />

      <View className="flex items-center justify-center">
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>

        <Pressable onPress={() => router.replace("/user/bottomNav")}>
          <Text className="text-sm text-info">Go to home screen one!</Text>
        </Pressable>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
        <View className="w-[8em] h-20 border-2 border-primary bg-base-100">
          <Text className="dark:bg-primary-content py-28 text-center text-primary">
            height
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
  linkText: {
    fontSize: 14,
    color: "#2e78b7",
  },
});

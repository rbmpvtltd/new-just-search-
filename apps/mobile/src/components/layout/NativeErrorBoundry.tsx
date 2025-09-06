import {
  getCrashlytics,
  recordError,
} from "@react-native-firebase/crashlytics";
import { Text, View } from "react-native";

export default function ErrorHandler({ error }: { error: any }) {
  const crash = getCrashlytics();
  recordError(crash, Error(`UI crash in component : ${error.message}`));

  return (
    <View className="flex flex-1 px-8 py-4 bg-secondary justify-center items-center">
      <Text className="text-base-100 text-2xl">
        Something went wrong. We've reported the issue.
      </Text>
    </View>
  );
}

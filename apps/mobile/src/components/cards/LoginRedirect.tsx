import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Colors from "@/constants/Colors";

function LoginRedirect() {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const showInfo = () => {
    Alert.alert(
      "Why do I need to sign in?",
      "We require authentication to ensure all reviews are from real customers and to prevent spam.",
      [{ text: "OK" }],
    );
  };

  return (
    <View className="bg-base-300 rounded-xl border border-secondary-content p-4 mx-4 my-2">
      <View className="flex-row gap-3 mb-4">
        <View className="bg-base-100 rounded-full w-11 h-11 justify-center items-center">
          <Ionicons
            name="lock-closed"
            size={24}
            color={Colors[colorScheme ?? "light"].primary}
          />
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-lg font-semibold text-primary">
            Authentication Required
          </Text>
          <Text className="text-sm text-secondary leading-5">
            Please log in or create an account to submit a review.
          </Text>
        </View>
      </View>

      <View className="gap-3">
        <TouchableOpacity
          className="bg-base-100 rounded-lg border border-secondary-content p-3 flex-row gap-2"
          onPress={showInfo}
        >
          <Ionicons
            name="information-circle-outline"
            size={20}
            color={Colors[colorScheme ?? "light"].primary}
          />
          <View className="flex-1 gap-1">
            <Text className="text-sm font-semibold text-primary">
              Why do I need to sign in?
            </Text>
            <Text className="text-xs text-secondary leading-4">
              We require authentication to ensure all reviews are from real
              customers and to prevent spam.
            </Text>
          </View>
        </TouchableOpacity>

        <View className="gap-3 pt-2">
          <TouchableOpacity
            className="bg-primary rounded-lg py-3 px-4 flex-row items-center justify-center gap-2"
            onPress={() => router.push("/(root)/profile")}
          >
            <Ionicons name="lock-closed" size={16} color="#fff" />
            <Text className="text-white text-base font-semibold">Log In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="bg-transparent rounded-lg py-3 px-4 flex-row items-center justify-center gap-2 border border-secondary-content"
            onPress={() => router.push("/(root)/profile")}
          >
            <Ionicons
              name="person-add-outline"
              size={16}
              color={Colors[colorScheme ?? "light"].secondary}
            />
            <Text className="text-secondary text-base font-semibold">
              Create Account
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default LoginRedirect;
